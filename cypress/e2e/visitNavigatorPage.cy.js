describe('Navigator test', () => {
  it('Otvori navigator stranicu i provjeri default URL', () => {
    cy.visit('www.navigator.ba');
    //check url
    cy.url().should('include', 'www.navigator.ba/#/categories')
  });
});