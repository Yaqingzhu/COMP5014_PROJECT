import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

Given('I open the {string} page', path => {
  cy.visit(`http://localhost:8081${path}`);
});

Given('I wait for the api to respond', () => {
  cy.wait(150);
});

Then('I see {string} in a {string} tag', (message, tag) => {
  cy.get(tag).should('have.text', message);
});
