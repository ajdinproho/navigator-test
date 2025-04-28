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
  it('Otvori Sarajevska pozorista, klikni na Narodno pozorište na mapi i provjeri je li otvoreno', () => {
    cy.get('.categories').find('.list-item').contains('SARAJEVSKA POZORIŠTA').click();
    cy.url().should('include', 'www.navigator.ba/#/list/sarajevska-pozorista');
    cy.wait(500);
    cy.get('.leaflet-marker-pane').contains('Narodno pozorište').click();
    cy.url().should('include', 'www.navigator.ba/#/p/narodno-pozoriste?list=sarajevska-pozorista');
    cy.get('.place_details').find('.breadcrumbs-container').should('contain', 'Pozorište');
    cy.get('.place_details').find('.breadcrumbs-container').should('contain', 'Narodno pozorište');
  });
  it('Nakon što je otvoreno Narodno pozorište, provjeri podatke o pozorištu koji su prikazani lijevo', () => {
    cy.get('.place_details').find('.content').find('.basic-info').should('contain', 'Obala Kulina bana 9');
    cy.get('.place_details').find('.content').find('.basic-info').should('contain', '033 226 431');
    cy.get('.place_details').find('.content').find('.basic-info').should('contain', 'np@npsa.ba');
    cy.get('.place_details').find('.description-container').should('contain', 'Narodno pozorište Sarajevo osnovano je 17. 11. 1919. godine');
  });
  it('Provjeri quick info o pozorištu koje je otvoreno na mapi', () => {
    cy.get('.leaflet-popup-content-wrapper').contains('Narodno pozorište');
    cy.get('.leaflet-popup-content-wrapper').contains('Narodno pozorište').parent().should('contain', 'Obala Kulina bana 9');
    cy.get('.leaflet-popup-content-wrapper').contains('Narodno pozorište').parent().should('contain', '033 226 431');
    cy.get('.leaflet-popup-content-wrapper').contains('Narodno pozorište').parent().should('contain', 'nps.ba');
  });
});