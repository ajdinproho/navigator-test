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
});