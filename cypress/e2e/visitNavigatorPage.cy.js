describe('Navigator', () => {
  it('Visit navigator page', () => {
    cy.visit('www.navigator.ba')
    cy.url().should('include', 'www.navigator.ba/#/categories')
  })
})