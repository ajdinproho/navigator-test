describe('Navigator tests', () => {
  it('Open navigator page and verify that requests made on page load are successful', () => {
    cy.visit('www.navigator.ba');
    cy.request({
      method: 'GET',
      url: 'http://www.navigator.ba/categories',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.categories).to.have.length(12);
    });
    cy.request({
      method: 'GET',
      url: 'http://www.navigator.ba/lists',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.lists).to.have.length(3);
    });
    cy.request({
      method: 'GET',
      url: 'http://www.navigator.ba/categories/suggested',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.categories).to.have.length(6);
    });
  });
  it('Open one of the categories "Smještaj" and check if the request is successful', () => {
    cy.intercept({
      method: 'GET',
      url: 'http://www.navigator.ba/places?category_id=3&offset=0&lat=43.8513&lon=18.38871'
    }).as('getSmjestaj');
    cy.getCategory('SMJEŠTAJ').click({ force: true });
    cy.wait('@getSmjestaj').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      // check did it load 50 places in the response
      expect(interception.response.body.places).to.have.length(50);
    });
  });
  it('Navigate directly to the link of a place and check is it successfully loaded on map and on the left side, also check GET request and verify some of the responses', () => {
    cy.visit('http://www.navigator.ba/#/p/pozoriste-mladih?list=sarajevska-pozorista');
    cy.checkPlace('Pozorište', 'Pozorište mladih Sarajevo', 'Kulovića 8', '033 202 303', 'pozmladi@bih.net.ba');
    cy.checkQuickInfoInMap('Pozorište mladih', 'Kulovića 8', '033 202 303', 'www.pozoristemladih.ba');
    cy.request({
      method: 'GET',
      url: 'http://www.navigator.ba/places/pozoriste-mladih',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.place).to.have.property('name', 'Pozorište mladih Sarajevo');
      expect(response.body.place).to.have.property('city_name', 'Sarajevo');
      expect(response.body.place).to.have.property('category_identifier', 'Theater');
      expect(response.body.place).to.have.property('email', 'pozmladi@bih.net.ba');
      expect(response.body.place).to.have.property('slug', 'pozoriste-mladih');
      expect(response.body.place.main_category).to.have.property('name', 'Pozorište');
      expect(response.body.place.main_category).to.have.property('identifier', 'Theater');
    });
  });
  it('Send feedback, POST request should pass and error message should appear in popup', () => {
    cy.get(selectors.common.headerContainer)
      .find(selectors.common.navigation)
      .find('.iconav-bubble-2')
      .parent()
      .find('.text')
      .contains('Predloži ideju - Pošalji komentar')
      .click();
    cy.get(selectors.common.navLefthandFormContainer).find('input[placeholder="Ime i prezime"]').type('Test User');
    cy.get(selectors.common.navLefthandFormContainer).find('input[placeholder="Email"]').type('testuser@email.com');
    cy.get(selectors.common.navLefthandFormContainer).find('textarea[placeholder="Komentar"]').click().type('Test feedback');
    cy.get(selectors.common.navLefthandFormContainer).contains('Kritika').click();
    cy.intercept('POST', 'http://www.navigator.ba/feedback' , (req) => {
      const parsedBody = new URLSearchParams(req.body);
      expect(parsedBody.get('name_surname')).to.eq('Test User');
      expect(parsedBody.get('email')).to.eq('testuser@email.com');
      expect(parsedBody.get('comment')).to.eq('Test feedback');
      expect(parsedBody.get('type')).to.eq('Kritika');
    }).as('sendFeedback');
    cy.get(selectors.common.navLefthandFormContainer).find('.green-button').contains('Pošalji').click();
    cy.wait('@sendFeedback').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property('error', true);
      expect(interception.response.body.error_msgs).to.include('Došlo je do neočekivane greške. Molimo pokušajte ponovo');
    // check red error message
    cy.get(selectors.common.navLefthandFormContainer)
      .find('.alert-error')
      .should('contain', 'Greška prilikom slanja poruke')
      .and('contain', 'Došlo je do neočekivane greške. Molimo pokušajte ponovo')
      .and('have.css', 'color', 'rgb(185, 74, 72)');
    });
  });
});