import { selectors } from '../../helpers/selectors.js';

export class NavigatorPage {
    visitHomePage() {
        cy.visit('/');
    }

    openCategory(category) {
        cy.getCategory(category).click({ force: true });
    }

    openFeedbackForm() {
        cy.get('.iconav-bubble-2')
          .parent()
          .find('.text')
          .contains('Predloži ideju - Pošalji komentar')
          .click();
    }

    openCreatePlaceForm() {
        cy.get(selectors.common.headerContainer)
          .find(selectors.common.navigation)
          .find('.iconav-plus')
          .parent()
          .find('.text')
          .contains('Kreiraj objekat')
          .click();
    }

    submitCreatePlaceForm() {
        cy.get(selectors.common.navLefthandFormContainer)
          .find('.submit-container')
          .find('.btn-success')
          .contains('Kreiraj')
          .click({ force: true });
    }

    fillFeedbackForm(name, email, comment, type) {
        cy.get('input[placeholder="Ime i prezime"]').type(name);
        cy.get('input[placeholder="Email"]').type(email);
        cy.get('textarea[placeholder="Komentar"]').type(comment);
        cy.contains(type).click();
    }

    submitFeedbackForm() {
        cy.get(selectors.common.navLefthandFormContainer)
          .find('.green-button')
          .contains('Pošalji')
          .click();
    }

    checkErrorMessage() {
        cy.get('.alert-error')
          .should('contain', 'Greška prilikom slanja poruke')
          .and('have.css', 'color', 'rgb(185, 74, 72)');
    }
}