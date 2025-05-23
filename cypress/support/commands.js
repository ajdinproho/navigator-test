import { selectors } from "../helpers/selectors.js";
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getCategory', (category) => {
    cy.get('.categories').find('li').contains(`${category}`);
});

Cypress.Commands.add('getListItem', (listItem) => {
    cy.get('.categories').find('.list-item').contains(`${listItem}`);
});

Cypress.Commands.add('checkPlace', (category, title, street, contact, mail) => {
    cy.get(selectors.common.placeDetails).find(selectors.common.breadcrumbsContainer).should('contain', `${category}`);
    cy.get(selectors.common.placeDetails).find(selectors.common.breadcrumbsContainer).should('contain', `${title}`);
    cy.get(selectors.common.placeDetails).find(selectors.common.content).find(selectors.common.basicInfo).should('contain', `${street}`);
    cy.get(selectors.common.placeDetails).find(selectors.common.content).find(selectors.common.basicInfo).should('contain', `${contact}`);
    cy.get(selectors.common.placeDetails).find(selectors.common.content).find(selectors.common.basicInfo).should('contain', `${mail}`);
});

Cypress.Commands.add('checkQuickInfoInMap', (title, street, contact, web) => {
    cy.get(selectors.common.leafletPopupContentWrapper).contains(`${title}`);
    cy.get(selectors.common.leafletPopupContentWrapper).contains(`${title}`).parent().should('contain', `${street}`);
    cy.get(selectors.common.leafletPopupContentWrapper).contains(`${title}`).parent().should('contain', `${contact}`);
    cy.get(selectors.common.leafletPopupContentWrapper).contains(`${title}`).parent().should('contain', `${web}`);
});

Cypress.Commands.add('switchLanguage', (language) => {
    cy.get('#header_container').find('.languages').contains(`${language}`).click();
    //provjera da li je EN aktivan u headeru
    cy.get('#header_container').find('.languages').contains(`${language}`).parent().should('have.class', 'active');
});

Cypress.Commands.add('openHomePageClickingOnLogoInHeader', () => {
    cy.get(selectors.common.headerContainer).find('.logo').click();
});

Cypress.Commands.add('searchForSomethingPressingEnter', (text) => {
    cy.get(selectors.common.headerContainer)
      .find(selectors.common.headerSearch)
      .find('input[placeholder="Traži ulicu ili objekat"]')
      .click()
      .type(`${text}{enter}`);
});

Cypress.Commands.add('searchForSomethingClickingSearchIcon', (text) => {
    cy.get(selectors.common.headerContainer)
      .find(selectors.common.headerSearch)
      .find('input[placeholder="Traži ulicu ili objekat"]')
      .click()
      .type(`${text}`);
    cy.get(selectors.common.headerContainer)
       .find(selectors.common.headerSearch)
       .find('.iconav-search')
       .click();
});

Cypress.Commands.add('checkSuggestedSearchResult', (category, name) => {
    cy.get('.search-suggestion-box-wrapper')
      .contains(`${category}`)
      .parent()
      .should('contain', `${name}`);
});
