describe('Navigator test', () => {
  it('Otvori navigator stranicu i provjeri default URL', () => {
    cy.visit('www.navigator.ba');
    //check url
    cy.url().should('include', 'www.navigator.ba/#/categories')
  });
  it('Provjeri header i jesu li default kategorije prikazane', () => {
    cy.get('#header_container').find('.navigation').find('span').should('have.class', 'iconav-plus');
    cy.get('#header_container').find('.navigation').find('.iconav-plus').parent().find('.text').contains('Kreiraj objekat').should('be.visible');
    cy.get('#header_container').find('.navigation').find('span').should('have.class', 'iconav-bubble-2');
    cy.get('#header_container').find('.navigation').find('.iconav-bubble-2').parent().find('.text').contains('Predloži ideju - Pošalji komentar').should('be.visible');
    cy.getCategory('SMJEŠTAJ');
    cy.getCategory('KAFA');
    cy.getCategory('HRANA');
    cy.getCategory('NOĆNI ŽIVOT');
    cy.getCategory('KUPOVINA');
    cy.getCategory('ATRAKCIJE');
    cy.getCategory('UMJETNOST I ZABAVA');
    cy.getCategory('SPORT');
    cy.getCategory('PRIJEVOZ');
    cy.getCategory('USLUGE');
    cy.getCategory('BIZNIS');
    cy.getCategory('GRADSKE ULICE');
  });
  it('Provjeri da li je default stranica prikazana dobro na tablet viewportu', () => {
    cy.viewport('ipad-2');
    cy.get('#header_container').find('.navigation').find('span').should('have.class', 'iconav-plus');
    cy.get('#header_container').find('.navigation').find('.iconav-plus').parent().find('.text').contains('Kreiraj objekat').should('not.be.visible');
    cy.get('#header_container').find('.navigation').find('span').should('have.class', 'iconav-bubble-2');
    cy.get('#header_container').find('.navigation').find('.iconav-bubble-2').parent().find('.text').contains('Predloži ideju - Pošalji komentar').should('not.be.visible');
  });
});