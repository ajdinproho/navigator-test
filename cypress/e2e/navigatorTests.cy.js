import { selectors } from '../helpers/selectors.js';

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
      // running this test in the cypress UI while console is open will pass if I check status code for 200
      // but if I run it in the cypress UI without console open, it will fail because status code is 304
      // so I will check for both status codes or I will check that status code not to be 400, 404, 500

      expect([200, 304]).to.include(interception.response.statusCode);
      // expect(interception.response.statusCode).to.not.be.oneOf([400, 401, 404, 500]);
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
  // I wrote this because while testing I noticed that the request always passes with 200 status code
  // and the response is always the same error message
  // so I will check if the request is successful and if the response contains the error message
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
  it('Click in the empty search field should open dropdown with lists and categories', () => {
    cy.get(selectors.common.headerContainer)
      .find(selectors.common.headerSearch)
      .find('input[placeholder="Traži ulicu ili objekat"]')
      .click();
    cy.get('.search-suggestion-box-wrapper').should('be.visible');
    cy.checkSuggestedSearchResult('Ponude', 'Sarajevska pozorišta');
    cy.checkSuggestedSearchResult('Ponude', 'Nextbike');
    cy.checkSuggestedSearchResult('Ponude', 'Smoke-free public places');
    cy.checkSuggestedSearchResult('Kategorije', 'Smještaj');
    cy.checkSuggestedSearchResult('Kategorije', 'Hrana');
    cy.checkSuggestedSearchResult('Kategorije', 'Kafa');
    cy.checkSuggestedSearchResult('Kategorije', 'Noćni život');
    cy.checkSuggestedSearchResult('Kategorije', 'Kupovina');
    cy.checkSuggestedSearchResult('Kategorije', 'Gradske ulice');
  });
  it('Error message should appear in popup if you try to create a place without entering any data', () => {
    cy.get(selectors.common.headerContainer)
      .find(selectors.common.navigation)
      .find('.iconav-plus')
      .parent()
      .find('.text')
      .contains('Kreiraj objekat')
      .click();
    cy.get(selectors.common.navLefthandFormContainer).find('.submit-container').find('.btn-success').contains('Kreiraj').click({ force: true });
    cy.get(selectors.common.navLefthandFormContainer)
      .find('.validation-error-msg')
      .should('contain', 'Forma sadrži nevalidne podatke. Molimo ispravite i pokušajte ponovo')
      .and('have.css', 'color', 'rgb(185, 74, 72)');
    cy.get(selectors.common.navLefthandFormContainer)
      .find('.categories-error-msg')
      .should('contain', 'Molimo odaberite kategoriju kojoj objekat pripada')
      .and('have.css', 'color', 'rgb(185, 74, 72)');
    cy.get(selectors.common.navLefthandFormContainer)
      .find('#poi_name')
      .should('have.class', 'required')
      .and('have.css', 'border-color', 'rgb(185, 74, 72)');
  });
  it('Try to send feedback without entering any data - comment field should change border color to red because it is required', () => {
    cy.get(selectors.common.headerContainer)
      .find(selectors.common.navigation)
      .find('.iconav-bubble-2')
      .parent()
      .find('.text')
      .contains('Predloži ideju - Pošalji komentar')
      .click();
    cy.get(selectors.common.navLefthandFormContainer).find('.green-button').contains('Pošalji').click();
    cy.get(selectors.common.navLefthandFormContainer)
      .find('textarea[placeholder="Komentar"]')
      .should('have.class', 'required')
      .and('have.css', 'border-color', 'rgb(185, 74, 72)');
  });
  it('Check recent search clicking on a button - it should search for last searched word', () => {
    cy.searchForSomethingPressingEnter('Pionirska dolina');
    cy.get('.search-results').find('li').contains('Zoološki vrt Pionirska dolina').should('be.visible');
    // navigate to the homepage
    cy.openHomePageClickingOnLogoInHeader();
    // new button Rezultati pretrage should appear - click on it should open last searched place
    cy.getCategory('REZULTATI PRETRAGE').click({ force: true });
    cy.get(selectors.common.headerContainer)
      .find(selectors.common.headerSearch)
      .should('contain', 'Pionirska dolina');
    cy.get('.search-results').find('li').contains('Zoološki vrt Pionirska dolina').should('be.visible');
  });
});