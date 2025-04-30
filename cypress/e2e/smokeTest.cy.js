import { selectors } from "../helpers/selectors.js";

describe('Navigator smoke test', () => {
  it('Open navigator homepage and check default URL', () => {
    cy.visit('www.navigator.ba');
    // check url
    cy.url().should('include', 'www.navigator.ba/#/categories')
  });
  it('Responsiveness - Check if default page displays correctly on desktop browser', () => {
    cy.get(selectors.common.headerContainer)
      .find(selectors.common.navigation)
      .find('span')
      .should('have.class', 'iconav-plus');
    cy.get(selectors.common.headerContainer)
      .find(selectors.common.navigation)
      .find('.iconav-plus')
      .parent()
      .find('.text')
      .contains('Kreiraj objekat')
      .should('be.visible');
    cy.get(selectors.common.headerContainer)
      .find(selectors.common.navigation)
      .find('span')
      .should('have.class', 'iconav-bubble-2');
    cy.get(selectors.common.headerContainer)
      .find(selectors.common.navigation)
      .find('.iconav-bubble-2')
      .parent()
      .find('.text')
      .contains('Predloži ideju - Pošalji komentar')
      .should('be.visible');
    cy.getListItem('SARAJEVSKA POZORIŠTA')
      .parent()
      .find('.description')
      .contains('Rezervirajte ulaznice za predstave pozorišta')
      .parent()
      .find('.info')
      .should('contain', '5')
      .and('contain', 'lokacija');
    cy.getListItem('NEXTBIKE')
      .parent()
      .find('.description')
      .contains('Sistem javnih bicikala')
      .parent()
      .find('.info')
      .should('contain', '9')
      .and('contain', 'lokacija');
    cy.getListItem('SMOKE-FREE PUBLIC PLACES')
      .parent()
      .find('.description')
      .contains('Smoke-free public places')
      .parent()
      .find('.info')
      .should('contain', '15')
      .and('contain', 'lokacija');
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
  it('Search for existing street - Enter name of existing street and check if it appears in search results after pressing enter', () => {
    cy.get(selectors.common.headerContainer)
      .find('#header_search')
      .find('input[placeholder="Traži ulicu ili objekat"]')
      .click()
      .type('Ferhadija');
    // check if search results are displayed in the menu
    cy.get(selectors.common.ttSuggestions)
      .find(selectors.common.ttSuggestion)
      .should('contain', 'Ferhadija');
    // load search results
    cy.get(selectors.common.headerContainer)
      .find('#header_search')
      .find('input[placeholder="Traži ulicu ili objekat"]')
      .click()
      .type('{enter}');
    // I noticed that sometimes it fetch street-icon@2x.png and sometimes street-icon.png - because of the resolution
    // so I will check if it contains street-icon or street-icon@2x
    cy.get('.search-panel')
      .find('.search-results')
      .contains('Ferhadija')
      .parent()
      .find('img')
      .should('have.attr', 'src')
      .and('match', /street-icon(@2x)?\.png$/)
  });
  it('Search and display existing place - Enter name of existing place, select that place and check if correct data is displayed when clicking on the search icon', () => {
    cy.get(selectors.common.headerContainer)
      .find('#header_search')
      .find('input[placeholder="Traži ulicu ili objekat"]')
      .click()
      .type('{selectall}{backspace}DM - Ferhadija');
    cy.get(selectors.common.ttSuggestions)
      .find(selectors.common.ttSuggestion)
      .should('contain', 'DM - Ferhadija');
    cy.get(selectors.common.ttSuggestions)
      .find(selectors.common.ttSuggestion)
      .contains('DM - Ferhadija').click();
    cy.checkPlace('Kozmetika', 'DM - Ferhadija', 'Ferhadija 25', '033 572 115', 'info@dm-drogeriemarkt.ba');
    cy.checkQuickInfoInMap('DM - Ferhadija', 'Ferhadija 25', '033 572 115', 'www.dm-drogeriemarkt.ba');
  });
  it('Map interaction - Open Sarajevska pozorišta, click on Narodno pozorište on the map and check if it opens', () => {
    cy.openHomePageClickingOnLogoInHeader().click();
    cy.wait(500);
    cy.get('.categories')
      .find('.list-item')
      .contains('SARAJEVSKA POZORIŠTA')
      .click({ force: true });
    cy.url().should('include', 'www.navigator.ba/#/list/sarajevska-pozorista');
    cy.wait(500);
    cy.get('.leaflet-marker-pane').contains('Narodno pozorište').click();
    cy.url().should('include', 'www.navigator.ba/#/p/narodno-pozoriste?list=sarajevska-pozorista');
    cy.get(selectors.common.placeDetails)
      .find('.breadcrumbs-container')
      .should('contain', 'Pozorište');
    cy.get(selectors.common.placeDetails)
      .find('.breadcrumbs-container')
      .should('contain', 'Narodno pozorište');
  });
  it('Detailed place view - After opening Narodno pozorište, check theater information displayed on the left', () => {
    cy.checkPlace('Pozorište', 'Narodno pozorište', 'Obala Kulina bana 9', '033 226 431', 'np@npsa.ba');
    cy.get(selectors.common.placeDetails)
      .find('.description-container')
      .should('contain', 'Narodno pozorište Sarajevo osnovano je 17. 11. 1919. godine');
  });
  it('Map interaction - Check quick info about the theater that is open on the map', () => {
    cy.checkQuickInfoInMap('Narodno pozorište', 'Obala Kulina bana 9', '033 226 431', 'nps.ba');
  });
  it('English localization - check if UI elements are translated and if EN is active in header', () => {
    cy.openHomePageClickingOnLogoInHeader().click();
    cy.switchLanguage('EN');
    // check are categories translated
    cy.getListItem('SARAJEVO THEATRES')
      .parent()
      .find('.description')
      .contains('Book a ticket for Sarajevo theatres')
      .parent()
      .find('.info')
      .should('contain', '5')
      .and('contain', 'places');
    cy.getListItem('NEXTBIKE')
      .parent()
      .find('.description')
      .contains('Public Bike Sharing')
      .parent()
      .find('.info')
      .should('contain', '9')
      .and('contain', 'places');
    cy.getListItem('SMOKE-FREE PUBLIC PLACES')
      .parent()
      .find('.description')
      .contains('Smoke-free public places')
      .parent()
      .find('.info')
      .should('contain', '15')
      .and('contain', 'places');
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
    // check are header elements translated
    cy.get(selectors.common.headerContainer)
      .find('#header_search')
      .find('input[placeholder="Search street or place"]')
      .should('exist');
    cy.get(selectors.common.headerContainer)
      .find(selectors.common.navigation)
      .find('.iconav-plus')
      .parent()
      .find('.text')
      .contains('Create Place')
      .should('be.visible');
    cy.get(selectors.common.headerContainer)
      .find(selectors.common.navigation)
      .find('.iconav-bubble-2')
      .parent()
      .find('.text')
      .contains('Suggest features - Report a problem')
      .should('be.visible');
    // check message if street does not exist
    cy.get(selectors.common.headerContainer)
      .find('#header_search')
      .find('input[placeholder="Search street or place"]')
      .click()
      .type('nema ove ulice{enter}');
    cy.get('.no-search-results')
      .should('contain', 'Results for query "nema ove ulice"')
      .and('contain', 'We are sorry. We could not find any results matching your search term.');
    cy.get('.no-search-results').find('.green-button').should('contain', 'Add this place');
    cy.get('.no-search-results').should('contain', 'Suggest a feature or report an error.');
    cy.get('.no-search-results').find('.grey-button').should('contain', 'Suggest features - Report a problem');
    // check About in footer
    cy.get('#footer').contains('About').click();
    // check are header elements translated
    cy.url().should('include', 'www.navigator.ba/#/about');
    cy.get(selectors.common.aboutPage).find('h2').should('contain', 'A new concept & visual identity');
    cy.get(selectors.common.aboutPage).find('.right').click();
    cy.get(selectors.common.aboutPage).find('h2').should('contain', 'Available on all popular devices');
    cy.get(selectors.common.aboutPage).find('.right').click();
    cy.get(selectors.common.aboutPage).find('h2').should('contain', 'Fresh content');
    cy.get('.static-header-inner').find('.logo').scrollIntoView().click();
    // check suggest features popup
    cy.get(selectors.common.headerContainer)
      .find(selectors.common.navigation)
      .find('.iconav-bubble-2')
      .parent()
      .find('.text')
      .contains('Suggest features - Report a problem')
      .click();
    cy.get(selectors.common.navLefthandFormContainer)
      .should('contain', 'Make Navigator a better place')
      .and('contain', 'Suggest a feature or report an error')
      .and('contain', ' I like it | Send this to both team and their boss')
      .and('contain', `Something's wrong | Send this to the team and skip their boss`);
    cy.get(selectors.common.navLefthandFormContainer).find('input[placeholder="Name and surname"]').should('exist');
    cy.get(selectors.common.navLefthandFormContainer).find('input[placeholder="Email"]').should('exist');
    cy.get(selectors.common.navLefthandFormContainer).find('textarea[placeholder="Comment"]').should('exist');
    cy.get(selectors.common.navLefthandFormContainer).find('.green-button').should('have.value','Send');
    cy.get(selectors.common.navLefthandFormContainer).find('.grey-button').should('have.value','Cancel');
    // switch language back to Bosnian
    cy.switchLanguage('BS');
  });
  it('Responsiveness - Check if default page displays correctly on tablet viewport', () => {
    cy.viewport('ipad-2');
    cy.openHomePageClickingOnLogoInHeader().click();
    cy.wait(500);
    cy.reload();
    cy.get(selectors.common.headerContainer)
      .find(selectors.common.navigation)
      .find('span')
      .should('have.class', 'iconav-plus');
    cy.get(selectors.common.headerContainer)
      .find(selectors.common.navigation)
      .find('.iconav-plus')
      .parent()
      .find('.text')
      .contains('Kreiraj objekat')
      .should('not.be.visible');
    cy.get(selectors.common.headerContainer)
      .find(selectors.common.navigation)
      .find('span')
      .should('have.class', 'iconav-bubble-2');
    cy.get(selectors.common.headerContainer)
      .find(selectors.common.navigation)
      .find('.iconav-bubble-2')
      .parent()
      .find('.text')
      .contains('Predloži ideju - Pošalji komentar')
      .should('not.be.visible');
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
  // this test case is not relevant, because cypress cannot check it on mobile correctly, it will not show it like it is on the real device
  it.skip('Responsiveness - Check if default page displays correctly on mobile viewport', () => {
    cy.viewport('iphone-x');
    cy.reload();
    cy.get(selectors.common.headerContainer)
      .find(selectors.common.navigation)
      .find('span')
      .should('have.class', 'iconav-plus');
    cy.get(selectors.common.headerContainer)
      .find(selectors.common.navigation)
      .find('.iconav-plus')
      .parent()
      .find('.text')
      .contains('Kreiraj objekat')
      .should('not.be.visible');
    cy.get(selectors.common.headerContainer)
      .find(selectors.common.navigation)
      .find('span')
      .should('have.class', 'iconav-bubble-2');
    cy.get(selectors.common.headerContainer)
      .find(selectors.common.navigation)
      .find('.iconav-bubble-2')
      .parent()
      .find('.text')
      .contains('Predloži ideju - Pošalji komentar')
      .should('not.be.visible');
  });
  it('Should not execute script when searching with XSS payload - this test should fail because bug exists in production', () => {
    cy.viewport(1512, 982);
    const text = 'ajdin test';
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });
    cy.searchForSomethingClickingSearchIcon(text);
    // allow time for script to trigger
    cy.wait(1000);
    // Assert that alert was never called
    cy.get('@alert').should('not.have.been.called');
  });
});