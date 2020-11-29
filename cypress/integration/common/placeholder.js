import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('I open the {string} page', path => {
    cy.visit(`http://localhost:8081${path}`);
});

Given('I use {int} as username and {string} as password', (username, password) => {
    cy.log_in(username, password);
})

Given('I am a student without account', () => {
    cy.visit(`http://localhost:8081/`);
    cy.click_button('Register to the university', 'a');
})

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

When('I see the courses in a table', () => {
    cy.get('.thead-dark > tr').should('be.visible');
    cy.get('.thead-dark > tr > :nth-child(1)').should('be.visible').and('have.text', "#");
    cy.get('.thead-dark > tr > :nth-child(2)').should('be.visible').and('have.text', "Name");
    cy.get('.thead-dark > tr > :nth-child(3)').should('be.visible').and('have.text', "Status");
    cy.get('.thead-dark > tr > :nth-child(4)').should('be.visible').and('have.text', "Capacity");
    cy.get('.thead-dark > tr > :nth-child(5)').should('be.visible').and('have.text', "Commands");
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

When('I see the registration page', () => {
    cy.get('body').should('be.visible');
    cy.get('.img-fluid').should('be.visible');
    cy.get('[data-testid=name]').should('have.attr', 'placeholder', 'Name').and('not.be.disabled');
    cy.get('[data-testid=email]').should('have.attr', 'placeholder', 'Email').and('not.be.disabled');
    cy.get('.react-datepicker__input-container > .form-control').should('not.be.disabled');
    cy.get('[data-testid=password]').should('have.attr', 'placeholder', 'Password').and('not.be.disabled');
});

Then('I click on {string} button with tag {string}', (name, tag) => {
    cy.get(tag).should('have.text', name).and('not.be.disabled').click();
    cy.wait(200);
});

Then('I log out', () => {
    cy.log_out();
})

Then('I get an error message', () => {
    cy.get('.alert').should('have.text', 'login failed. Please check your password and user id.')
});

Then('I log in with valid credentials', () => {
    cy.log_in(1, "admin");
});

Then('I fill in with the information of the course to be created', () => {
    cy.get(':nth-child(1) > label').should('have.text', 'Course name');
    cy.get('[data-testid=name]').should('have.attr', 'placeholder', 'Some name').and('not.be.disabled');
    cy.get(':nth-child(2) > label').should('have.text', 'Course status');
    cy.get('[data-testid=status]').find('option').should('contain','Open').and('contain','Closed');
    cy.get(':nth-child(3) > label').should('have.text', 'Course capacity');
    cy.get('[data-testid=capacity]').should('have.attr', 'placeholder', '200').and('not.be.disabled');
    cy.get('[data-testid=name]').type('CompGeom');
    cy.get('[data-testid=capacity]').type('30');
});

Then('I can add a schedule for the course', () => {
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const hours = ["7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
        "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
        "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM"];
    cy.click_button('Add new slot', '.btn-secondary');
    cy.get('.form-row > :nth-child(1) > .form-control').find('option').each( (item, index) => {
        cy.wrap(item).should('contain.text', weekdays[index]);
    })
    cy.get('.form-row > :nth-child(2) > .form-control').find('option').each( (item, index) => {
        cy.wrap(item).should('contain.text', hours[index]);
    })
    cy.get('.card-body > .btn').should('have.text', "Delete slot").and('not.be.disabled');
})

Then('I see the course in the course dashboard', () => {
    cy.click_button('Save changes', '.btn-primary');
    cy.click_button('Courses', ':nth-child(2) > .nav-link');
    cy.location('pathname').should('contain', 'courses');
    cy.contains('.h2', 'Available courses').should('be.visible');
})

Then('I want to change capacity of the last course created to {int}', (capacity) => {
    cy.get('tr').its('length').then(($length) => {
        const rows = $length - 1;
        cy.get(`:nth-child(${rows}) > th`).each($elem => {
            const course = $elem.text();
            cy.click_button('Edit', `:nth-child(5) > [href="/courses/${course}"]`)
        })
        cy.get('[data-testid=capacity]').clear().type(capacity);
        cy.click_button('Save changes', '.btn-primary');
        cy.click_button('Courses', ':nth-child(2) > .nav-link');
        cy.contains(`tbody > :nth-child(${rows}) > :nth-child(4)`, capacity).should('be.visible');
    })
})

Then('I want to delete the last course created', () => {
    cy.get('tr').its('length').then(($length) => {
        const rows = $length - 1;
        cy.click_button('Delete', `:nth-child(${rows}) > :nth-child(5) > .ml-2`);
        cy.get('tbody > :nth-child(' + rows + ')').should('not.exist');
    })
})

Then('I fill in the form with {string} as name, {string} as email, {string} as birth date, and {string} as password', (name, email, birth, password) => {
    cy.get('[data-testid=name]').type(name);
    cy.get('[data-testid=email]').type(email);
    cy.get('input[name="birthDate"]').type('{selectall}'+birth);
    cy.get('[data-testid=password]').type(password);
    cy.click_button('Register', '.mt-4')
});

Then('The admin can see the application of student {string}', (email) => {
    cy.log_in(1, "admin");
    cy.click_button('Students', ":nth-child(3) > .nav-link");
    cy.get('.h2').should('be.visible').and('have.text', "Available students");
    cy.get('td').contains(email);
})
