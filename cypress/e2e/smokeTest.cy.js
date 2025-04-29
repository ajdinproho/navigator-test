import { selectors } from "../helpers/selectors.js";
describe('Navigator smoke test', () => {
  it('Otvori navigator stranicu i provjeri default URL', () => {
    cy.visit('www.navigator.ba');
    //check url
    cy.url().should('include', 'www.navigator.ba/#/categories')
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
  it('Provjeri header i jesu li default kategorije prikazane', () => {
    cy.get(selectors.common.headerContainer).find(selectors.common.navigation).find('span').should('have.class', 'iconav-plus');
    cy.get(selectors.common.headerContainer).find(selectors.common.navigation).find('.iconav-plus').parent().find('.text').contains('Kreiraj objekat').should('be.visible');
    cy.get(selectors.common.headerContainer).find(selectors.common.navigation).find('span').should('have.class', 'iconav-bubble-2');
    cy.get(selectors.common.headerContainer).find(selectors.common.navigation).find('.iconav-bubble-2').parent().find('.text').contains('Predloži ideju - Pošalji komentar').should('be.visible');
    cy.getListItem('SARAJEVSKA POZORIŠTA').parent().find('.description').contains('Rezervirajte ulaznice za predstave pozorišta').parent().find('.info').should('contain', '5').and('contain', 'lokacija');
    cy.getListItem('NEXTBIKE').parent().find('.description').contains('Sistem javnih bicikala').parent().find('.info').should('contain', '9').and('contain', 'lokacija');
    cy.getListItem('SMOKE-FREE PUBLIC PLACES').parent().find('.description').contains('Smoke-free public places').parent().find('.info').should('contain', '15').and('contain', 'lokacija');
    cy.getCategory('SMJEŠTAJ').and('contain','Hotel, Hostel, Motel, Apartman');
    cy.getCategory('KAFA').and('contain','Kafić, Kafana, Slastičarna, Desert');
    cy.getCategory('HRANA').and('contain','Restoran, Brza hrana, Pekara, Bosanska, Italijanska');
    cy.getCategory('NOĆNI ŽIVOT').and('contain','Noćni Klub, Pub, Bar, Lounge, Vinoteka');
    cy.getCategory('KUPOVINA').and('contain','Butik, Knjižara, Cvjećara, Supermarket, Trgovački centar');
    cy.getCategory('ATRAKCIJE').and('contain','Tvrđava, Džamija, Crkva, Park, Most');
    cy.getCategory('UMJETNOST I ZABAVA').and('contain','Kino, Pozorište, Muzej, Galerija, Casino');
    cy.getCategory('SPORT').and('contain','Fudbal, Košarka, Fitness, Plivanje, Kuglanje');
    cy.getCategory('PRIJEVOZ').and('contain','Taksi, Tramvaj, Parking, Benzinska pumpa');
    cy.getCategory('USLUGE').and('contain',`Banka, Pošta, Doktor, Škola, Ambasada`);
    cy.getCategory('BIZNIS').and('contain', 'Kompanija, Fabrika, Agencija');
    cy.getCategory('GRADSKE ULICE');
  });
  it('Pretraga postojeće ulice - Unijeti naziv postojeće ulice i provjeriti da li se prikazuje u rezultatima pretrage nakon što pritisnete enter', () => {
    cy.get(selectors.common.headerContainer).find('#header_search').find('input[placeholder="Traži ulicu ili objekat"]').click().type('Ferhadija');
    //provjeri rezultate pretrage u prikazanom meniju
    cy.get(selectors.common.ttSuggestions).find(selectors.common.ttSuggestion).should('contain', 'Ferhadija');
    //ucitaj rezultate pretrage
    cy.get(selectors.common.headerContainer).find('#header_search').find('input[placeholder="Traži ulicu ili objekat"]').click().type('{enter}');
    cy.get('.search-panel').find('.search-results').contains('Ferhadija').parent().find('img').should('have.attr', 'src', 'http://www.navigator.ba/assets/street-icon.png');
  });
  it('Pretraga i prikaz postojećeg objekta - Unijeti naziv postojećeg objekta, izabrati taj objekat i provjeriti da li se prikazuju tačni podaci klikom na search ikonu', () => {
    cy.get(selectors.common.headerContainer).find('#header_search').find('input[placeholder="Traži ulicu ili objekat"]').click().type('{selectall}{backspace}DM - Ferhadija');
    cy.get(selectors.common.ttSuggestions).find(selectors.common.ttSuggestion).should('contain', 'DM - Ferhadija');
    cy.get(selectors.common.ttSuggestions).find(selectors.common.ttSuggestion).contains('DM - Ferhadija').click();
    cy.checkPlace('Kozmetika', 'DM - Ferhadija', 'Ferhadija 25', '033 572 115', 'info@dm-drogeriemarkt.ba');
    cy.checkQuickInfoInMap('DM - Ferhadija', 'Ferhadija 25', '033 572 115', 'www.dm-drogeriemarkt.ba');
  });
  it('Otvori Sarajevska pozorista, klikni na Narodno pozorište na mapi i provjeri je li otvoreno', () => {
    cy.get(selectors.common.headerContainer).find('.logo').click();
    cy.wait(500);
    cy.get('.categories').find('.list-item').contains('SARAJEVSKA POZORIŠTA').click({ force: true });
    cy.url().should('include', 'www.navigator.ba/#/list/sarajevska-pozorista');
    cy.wait(500);
    cy.get('.leaflet-marker-pane').contains('Narodno pozorište').click();
    cy.url().should('include', 'www.navigator.ba/#/p/narodno-pozoriste?list=sarajevska-pozorista');
    cy.get(selectors.common.placeDetails).find('.breadcrumbs-container').should('contain', 'Pozorište');
    cy.get(selectors.common.placeDetails).find('.breadcrumbs-container').should('contain', 'Narodno pozorište');
  });
  it('Nakon što je otvoreno Narodno pozorište, provjeri podatke o pozorištu koji su prikazani lijevo', () => {
    cy.checkPlace('Pozorište', 'Narodno pozorište', 'Obala Kulina bana 9', '033 226 431', 'np@npsa.ba');
    cy.get(selectors.common.placeDetails).find('.description-container').should('contain', 'Narodno pozorište Sarajevo osnovano je 17. 11. 1919. godine');
  });
  it('Provjeri quick info o pozorištu koje je otvoreno na mapi', () => {
    cy.checkQuickInfoInMap('Narodno pozorište', 'Obala Kulina bana 9', '033 226 431', 'nps.ba');
  });
  it('Lokalizacija na engleski jezik, provjeri da li su UI elementi prevedeni i provjeri da li je EN aktivan u headeru', () => {
    cy.switchLanguage('EN');
    //provjera da li su UI elementi prevedeni
    cy.getListItem('SARAJEVO THEATRES').parent().find('.description').contains('Book a ticket for Sarajevo theatres').parent().find('.info').should('contain', '5').and('contain', 'places');
    cy.getListItem('NEXTBIKE').parent().find('.description').contains('Public Bike Sharing').parent().find('.info').should('contain', '9').and('contain', 'places');
    cy.getListItem('SMOKE-FREE PUBLIC PLACES').parent().find('.description').contains('Smoke-free public places').parent().find('.info').should('contain', '15').and('contain', 'places');
    cy.getCategory('ACCOMMODATION').and('contain','Hotel, Hostel, Motel, Apartment');
    cy.getCategory('COFFEE').and('contain','Coffee shop, Coffee bar, Patisseries, Dessert');
    cy.getCategory('FOOD').and('contain','Restaurant, Fast Food, Bakery, Bosnian, Italian');
    cy.getCategory('NIGHTLIFE').and('contain','Night Club, Pub, Bar, Lounge, Wine Bar');
    cy.getCategory('SHOPPING').and('contain','Boutique, Book Store, Flower Shop, Supermarket, Mall');
    cy.getCategory('ATTRACTIONS').and('contain','Tower, Mosque, Church, Park, Bridge');
    cy.getCategory('ARTS & ENTERTAINMENT').and('contain','Cinema, Theater, Museum, Gallery, Casino');
    cy.getCategory('SPORT').and('contain','Soccer, Basketball, Gym, Swimming, Bowling');
    cy.getCategory('TRANSPORTATION').and('contain','Taxi, Tram, Parking, Gas Station');
    cy.getCategory('SERVICES').and('contain',`Bank, Post Office, Doctor's Office, School, Embassy`);
    cy.getCategory('BUSINESS').and('contain', 'Company, Factory, Agency');
    cy.getCategory('STREETS');
    //provjera elemenata u headeru
    cy.get(selectors.common.headerContainer).find('#header_search').find('input[placeholder="Search street or place"]').should('exist');
    cy.get(selectors.common.headerContainer).find(selectors.common.navigation).find('.iconav-plus').parent().find('.text').contains('Create Place').should('be.visible');
    cy.get(selectors.common.headerContainer).find(selectors.common.navigation).find('.iconav-bubble-2').parent().find('.text').contains('Suggest features - Report a problem').should('be.visible');
    //provjera teksta ukoliko ulica ne postoji
    cy.get(selectors.common.headerContainer).find('#header_search').find('input[placeholder="Search street or place"]').click().type('nema ove ulice{enter}');
    cy.get('.no-search-results').should('contain', 'Results for query "nema ove ulice"').and('contain', 'We are sorry. We could not find any results matching your search term.');
    cy.get('.no-search-results').find('.green-button').should('contain', 'Add this place');
    cy.get('.no-search-results').should('contain', 'Suggest a feature or report an error.');
    cy.get('.no-search-results').find('.grey-button').should('contain', 'Suggest features - Report a problem');
    //provjera footera About us
    cy.get('#footer').contains('About').click();
    //provjera naslova na about stranici
    cy.url().should('include', 'www.navigator.ba/#/about');
    cy.get(selectors.common.aboutPage).find('h2').should('contain', 'A new concept & visual identity');
    cy.get(selectors.common.aboutPage).find('.right').click();
    cy.get(selectors.common.aboutPage).find('h2').should('contain', 'Available on all popular devices');
    cy.get(selectors.common.aboutPage).find('.right').click();
    cy.get(selectors.common.aboutPage).find('h2').should('contain', 'Fresh content');
    cy.get('.static-header-inner').find('.logo').scrollIntoView().click();
    //provjera prijedloga ideje
    cy.get(selectors.common.headerContainer).find(selectors.common.navigation).find('.iconav-bubble-2').parent().find('.text').contains('Suggest features - Report a problem').click();
    cy.get(selectors.common.navLefthandFormContainer).should('contain', 'Make Navigator a better place').and('contain', 'Suggest a feature or report an error').and('contain', ' I like it | Send this to both team and their boss').and('contain', `Something's wrong | Send this to the team and skip their boss`);
    cy.get(selectors.common.navLefthandFormContainer).find('input[placeholder="Name and surname"]').should('exist');
    cy.get(selectors.common.navLefthandFormContainer).find('input[placeholder="Email"]').should('exist');
    cy.get(selectors.common.navLefthandFormContainer).find('textarea[placeholder="Comment"]').should('exist');
    cy.get(selectors.common.navLefthandFormContainer).find('.green-button').should('have.value','Send');
    cy.get(selectors.common.navLefthandFormContainer).find('.grey-button').should('have.value','Cancel');
    //prebaci jezik ponovo na boasnski
    cy.switchLanguage('BS');
  });
  it('Provjeri da li je default stranica prikazana dobro na tablet viewportu', () => {
    cy.viewport('ipad-2');
    cy.get(selectors.common.headerContainer).find('.logo').click();
    cy.wait(500);
    cy.reload();
    cy.get(selectors.common.headerContainer).find(selectors.common.navigation).find('span').should('have.class', 'iconav-plus');
    cy.get(selectors.common.headerContainer).find(selectors.common.navigation).find('.iconav-plus').parent().find('.text').contains('Kreiraj objekat').should('not.be.visible');
    cy.get(selectors.common.headerContainer).find(selectors.common.navigation).find('span').should('have.class', 'iconav-bubble-2');
    cy.get(selectors.common.headerContainer).find(selectors.common.navigation).find('.iconav-bubble-2').parent().find('.text').contains('Predloži ideju - Pošalji komentar').should('not.be.visible');
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
  it('Provjeri da li je default stranica prikazana dobro na mobilnom viewportu', () => {
    cy.viewport('iphone-x');
    cy.reload();
    cy.get(selectors.common.headerContainer).find(selectors.common.navigation).find('span').should('have.class', 'iconav-plus');
    cy.get(selectors.common.headerContainer).find(selectors.common.navigation).find('.iconav-plus').parent().find('.text').contains('Kreiraj objekat').should('not.be.visible');
    cy.get(selectors.common.headerContainer).find(selectors.common.navigation).find('span').should('have.class', 'iconav-bubble-2');
    cy.get(selectors.common.headerContainer).find(selectors.common.navigation).find('.iconav-bubble-2').parent().find('.text').contains('Predloži ideju - Pošalji komentar').should('not.be.visible');
  });
});