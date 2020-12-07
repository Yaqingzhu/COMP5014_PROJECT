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
import 'cypress-file-upload';

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
});

Cypress.Commands.add('log_out', () => {
    cy.get('.navbar-nav').should('be.visible').and('have.text', 'Sign out').and('not.be.disabled').click();
    cy.url().should('eq', 'http://localhost:8081/login#');
});

Cypress.Commands.add('click_button', (name, tag) => {
    cy.get(tag).should('have.text', name).and('not.be.disabled').click();
    cy.wait(300);
});

Cypress.Commands.add('create_course', (name, capacity) => {
    cy.get(".btn").should('have.text', 'New course').and('not.be.disabled').click();
    cy.get(':nth-child(1) > label').should('have.text', 'Course name');
    cy.get('[data-testid=name]').should('have.attr', 'placeholder', 'Some name').and('not.be.disabled');
    cy.get(':nth-child(2) > label').should('have.text', 'Course status');
    cy.get('[data-testid=status]').find('option').should('contain', 'Open').and('contain', 'Closed').and('contain', 'Cancelled');
    cy.get(':nth-child(3) > label').should('have.text', 'Course capacity');
    cy.get('[data-testid=capacity]').should('have.attr', 'placeholder', '200').and('not.be.disabled');
    cy.get('[data-testid=name]').type(name);
    cy.get('[data-testid=capacity]').type(capacity);
    cy.click_button('Save changes', '.btn-primary');
    cy.click_button('Courses', ':nth-child(2) > .nav-link');
    cy.location('pathname').should('contain', 'courses');
    cy.contains('.h2', 'Available courses').should('be.visible');
});

Cypress.Commands.add('create_prof', (name, password) => {
    cy.log_in(1, 'admin');
    cy.click_button('Profs', ':nth-child(4)>.nav-link');
    cy.click_button('New prof', '.btn');
    cy.get('[data-testid=name]').type(name);
    cy.get('[data-testid=password]').type(password);
    cy.click_button('Save changes', '.btn-primary');
});

Cypress.Commands.add('assign_prof', (course, capacity, prof) => {
    cy.log_in(1, 'admin');
    cy.click_button('Courses', ':nth-child(2)>.nav-link');
    cy.click_button('New course', '.btn');

    cy.get('[data-testid=name]').type(course);
    cy.get('[data-testid=capacity]').type(capacity);
    cy.get('[data-testid=assignedProf]').select(prof);

    cy.click_button('Save changes', '.btn-primary');
});

Cypress.Commands.add('create_deliverable', (password, deliverable, date) => {
    cy.log_in(1, 'admin');
    cy.click_button('Profs', ':nth-child(4) > .nav-link');
    cy.get('tr').its('length').then($length => {
        const rows = $length - 1;
        cy.get(`tbody > :nth-child(${rows}) > :nth-child(1)`).each($elem => {
            const prof = $elem.text();
            cy.log_in(prof, password);
            cy.click_button('My courses', ':nth-child(2) > .nav-link');

            cy.get('tr').its('length').then($length => {
                const rows = $length - 1;
                cy.get(`tbody > :nth-child(${rows}) > :nth-child(2)`).each($elem => {
                    const course = $elem.text();
                    cy.click_button('Edit', `tbody > :nth-child(${rows}) > :nth-child(3) > a:nth-child(1)`);
                    cy.get(':nth-child(5) > .card-body > :nth-child(2) > form > .mb-3 > [data-testid=type]').should('have.attr', 'placeholder', 'Some type').and('not.be.disabled').type(deliverable);
                    cy.get(':nth-child(5) > .card-body > :nth-child(2) > form > .mb-3 > .react-datepicker-wrapper > .react-datepicker__input-container > .form-control').should('not.be.disabled').type('{selectall}'+date);
                    cy.click_button('Save changes', ':nth-child(5) > .card-body > :nth-child(2) > form > .btn');
                });
            });
        });
    });
});

Cypress.Commands.add('register_course', () => {
    cy.log_in(223, 'test');
    cy.click_button('My courses', ':nth-child(2) > .nav-link');

    cy.click_button('Register to a new course', '.btn');
    cy.get('tr').its('length').then($length => {
        const rows = $length - 1;
        cy.get(`tbody > :nth-child(${rows}) > :nth-child(1)`).each($elem => {
            const id = $elem.text();
            cy.get(`[data-testid=check-${id}]`).not('[disabled]').check();
            cy.click_button('Register', '.btn');
        });
    });
});
