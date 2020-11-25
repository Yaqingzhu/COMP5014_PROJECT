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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add('log_in', (username, password) => {
    cy.visit('http://localhost:8081/');
    cy.server();
    cy.route({
        method: 'POST',
        url: 'http://localhost:8081/login',
        response: 200
    }).as('login');
    cy.visit('http://localhost:8081/login');
    cy.get('input[type=text]').type(username).invoke('val').should((text) => {
        expect(text).to.eq(username.toString());
    });
    cy.get('input[type=password]').type(password).invoke('val').should((text) => {
        expect(text).to.eq(password);
    });
    cy.get('.mt-4').click();
})

Cypress.Commands.add('log_out', () => {
    cy.get('.navbar-nav').should('be.visible').and('have.text', 'Sign out').and('not.be.disabled').click();
    cy.url().should('eq', 'http://localhost:8081/login#')
})

Cypress.Commands.add('click_button', (name, tag) => {
    cy.get(tag).should('have.text', name).and('not.be.disabled').click();
    cy.wait(200);
})
