import selectors from '../../selectors/selectors';

export class NavigatorPage {
    visitHomePage() {
        cy.visit('/');
    }

    openCategory(category) {
        cy.getCategory(category).click({ force: true });
    }

    openFeedbackForm() {
        cy.get('.iconav-bubble-2').parent().find('.text').contains('Predloži ideju - Pošalji komentar').click();
    }

    fillFeedbackForm(name, email, comment, type) {
        cy.get('input[placeholder="Ime i prezime"]').type(name);
        cy.get('input[placeholder="Email"]').type(email);
        cy.get('textarea[placeholder="Komentar"]').type(comment);
        cy.contains(type).click();
    }

    submitFeedbackForm() {
        cy.get(selectors.common.navLefthandFormContainer).find('.green-button').contains('Pošalji').click();
    }

    checkErrorMessage() {
        cy.get('.alert-error')
          .should('contain', 'Greška prilikom slanja poruke')
          .and('have.css', 'color', 'rgb(185, 74, 72)');
    }
}