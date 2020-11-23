import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('I open the {string} page', path => {
  cy.visit(`http://localhost:8081${path}`);
});

When('I see a page', () => {
  cy.get('body').should('be.visible');
});

When('I see logo image in a {string} tag', (tag) => {
  cy.get(tag).should('be.visible');
});

When('I see {string} in a {string} tag', (message, tag) => {
  cy.get(tag).should('have.text', message).and('not.be.disabled');
});

When('I see {string} to fill in {string} tag', (gap, tag) => {
  cy.get(tag).should('have.attr', 'placeholder', gap).and('not.be.disabled');
});

Then('I fill in the fields with {int} as username and {string} as password', (username, password) => {
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
});

Then('I click on Login button', () => {
  cy.get('.mt-4').click();
  cy.wait(150);
});

