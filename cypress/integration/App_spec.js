describe('The application', () => {
  it('Loads the hellow world message', () => {
    cy.visit('http://localhost:8081');

    cy.wait(150);

    cy.get('h1').should('have.text', 'Hello World!');
  });
});
