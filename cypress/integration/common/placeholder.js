import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('I open the {string} page', path => {
    cy.visit(`http://localhost:8081${path}`);
});

Given('I use {int} as username and {string} as password', (username, password) => {
    cy.log_in(username, password);
});

Given('I am a student without account', () => {
    cy.visit('http://localhost:8081/');
    cy.click_button('Register to the university', 'a');
});

Given('I register on a course', () => {
    cy.register_course();
});

Given('The deliverable {string} of course {string} with prof {string} is created', (deliverable, course, prof) => {
    cy.create_prof(prof, prof);
    cy.assign_prof(course, 20, prof);
    cy.create_deliverable(prof, deliverable, "12/11/2020");
});

Given('I see student {string} delivered {string} for {string} course', (name, deliverable, course) => {
    cy.click_button('My courses', ':nth-child(2) > .nav-link');
    cy.get('tbody > tr > :nth-child(2)').should('have.text', course);
    cy.click_button('Edit', ':nth-child(3) > a');
    cy.get('.col-md-9 > :nth-child(1) > :nth-child(2)').should('have.text', 'Deliverables');
    cy.get('.col > .card > .card-body > :nth-child(2) > form > .mb-3 > [data-testid=type]').invoke('val').should(text => {
        expect(text).to.eq(deliverable.toString());
    });
    cy.get('.col > .card > .card-body > .card-title').should('contain', 'Deliverable');
    cy.click_button('View submissions', '.card-body > :nth-child(3)');
    cy.get('tbody > tr > th').should('have.text', 223);
    cy.get('tbody > tr > :nth-child(2)').should('have.text', name);
});

Given('Prof {string} wants to grade course {string}', (name, course) => {
    cy.log_in(1, 'admin');
    cy.click_button('Profs', ':nth-child(4) > .nav-link');
    cy.get('tr').its('length').then($length => {
        const rows = $length - 1;
        cy.get(`tbody > :nth-child(${rows}) > :nth-child(1)`).each($elem => {
            const prof = $elem.text();
            cy.log_in(prof, name);
            cy.click_button('My courses', ':nth-child(2) > .nav-link');
            cy.get('tbody > tr > :nth-child(2)').should('have.text', course);
            cy.click_button('Edit', ':nth-child(3) > a');
        });
    });
});

When('The grades are computed', () => {
    cy.get('h4').should('have.text', 'Are you ready to submit the final grades?');
    cy.click_button('Submit final grades', ':nth-child(7) > .btn');
    cy.get(':nth-child(7) > .alert').should('have.text', 'Grades were successfully computed.');
});

Then('I log in with valid student credentials', () => {
    cy.log_in(223, 'test');
});

Then('I log in with valid prof credentials', () => {
    cy.log_in(1, 'admin');
    cy.click_button('Profs', ':nth-child(4) > .nav-link');
    cy.get('tr').its('length').then($length => {
        const rows = $length - 1;
        cy.get(`tbody > :nth-child(${rows}) > :nth-child(1)`).each($elem => {
            const prof = $elem.text();
            cy.log_in(prof, 'prof');
        });
    });
});

When('I see a page', () => {
    cy.get('body').should('be.visible');
});

When('I see logo image in a {string} tag', tag => {
    cy.get(tag).should('be.visible');
});

When('I see {string} in a {string} tag', (message, tag) => {
    cy.get(tag).should('have.text', message).and('not.be.disabled');
});

When('I see {string} to fill in {string} tag', (gap, tag) => {
    cy.get(tag).should('have.attr', 'placeholder', gap).and('not.be.disabled');
});

When('I see the students in a table', () => {
    cy.get('.thead-dark > tr').should('be.visible');
    cy.get('.thead-dark > tr > :nth-child(1)').should('be.visible').and('have.text', '#');
    cy.get('.thead-dark > tr > :nth-child(2)').should('be.visible').and('have.text', 'Name');
    cy.get('.thead-dark > tr > :nth-child(3)').should('be.visible').and('have.text', 'Email');
    cy.get('.thead-dark > tr > :nth-child(4)').should('be.visible').and('have.text', 'Admitted');
    cy.get('.thead-dark > tr > :nth-child(5)').should('be.visible').and('have.text', 'Commands');
});

When('I see the profs in a table', () => {
    cy.get('.thead-dark > tr').should('be.visible');
    cy.get('.thead-dark > tr > :nth-child(1)').should('be.visible').and('have.text', '#');
    cy.get('.thead-dark > tr > :nth-child(2)').should('be.visible').and('have.text', 'Name');
    cy.get('.thead-dark > tr > :nth-child(3)').should('be.visible').and('have.text', 'Commands');
});

When('I see the registration page', () => {
    cy.get('body').should('be.visible');
    cy.get('.img-fluid').should('be.visible');
    cy.get('[data-testid=name]').should('have.attr', 'placeholder', 'Name').and('not.be.disabled');
    cy.get('[data-testid=email]').should('have.attr', 'placeholder', 'Email').and('not.be.disabled');
    cy.get('.react-datepicker__input-container > .form-control').should('not.be.disabled');
    cy.get('[data-testid=password]').should('have.attr', 'placeholder', 'Password').and('not.be.disabled');
});

When('I see the courses page', () => {
    cy.get('body').should('be.visible');
    cy.get('.col-md-9 > :nth-child(1) > :nth-child(3)').should('be.visible').and('have.text', 'Dropped courses');
    cy.get('.d-flex > .h2').should('be.visible').and('have.text', 'My courses');
    cy.get('.btn').should('not.be.disabled').and('have.text', 'Register to a new course');
});

When('I create the course {string} with capacity {int}', (course, capacity) => {
    cy.create_course(course, capacity);
});

When('I assign prof {string} to the last course created', prof => {
    cy.get('tr').its('length').then($length => {
        const rows = $length - 1;
        cy.get(`:nth-child(${rows}) > th`).each($elem => {
            const course = $elem.text();
            cy.click_button('Edit', `:nth-child(5) > [href="/courses/${course}"]`);
        });
        cy.get(':nth-child(4) > label').should('have.text', 'Assigned prof');
        cy.get('[data-testid=assignedProf]').find('option').should('contain', 'No prof').and('contain', prof);
        cy.get('[data-testid=assignedProf]').select(prof);
        cy.click_button('Save changes', '.btn-primary');
    });
});

When('I create the deliverable {string} for the last of my courses', deliverable => {
    cy.get('tr').its('length').then($length => {
        const rows = $length - 1;
        cy.get(`tbody > :nth-child(${rows}) > :nth-child(2)`).each($elem => {
            const course = $elem.text();
            cy.click_button('Edit', `tbody > :nth-child(${rows}) > :nth-child(3) > a:nth-child(1)`);
            cy.get('body').should('be.visible');
            cy.get('.h2').should('have.text', course);
            cy.get('.col-md-9 > :nth-child(1) > :nth-child(2)').should('have.text', 'Deliverables');
            cy.get(':nth-child(5) > .card-body > .card-title').should('have.text', 'Add a new deliverable');
            cy.get(':nth-child(5) > .card-body > :nth-child(2) > form > .mb-3 > [for="name"]').should('have.text', 'Deliverable type');
            cy.get(':nth-child(5) > .card-body > :nth-child(2) > form > .mb-3 > [data-testid=type]').should('have.attr', 'placeholder', 'Some type').and('not.be.disabled').type(deliverable);
            cy.get(':nth-child(5) > .card-body > :nth-child(2) > form > .mb-3 > [for="deliverableDeadline"]').should('have.text', 'Deadline');
            cy.get(':nth-child(5) > .card-body > :nth-child(2) > form > .mb-3 > .react-datepicker-wrapper > .react-datepicker__input-container > .form-control').should('not.be.disabled').type('{selectall}'+"12/11/2020");
            cy.get('.col-md-9 > :nth-child(1) > :nth-child(9)').should('have.text', 'Students registered in the course');
            cy.click_button('Save changes', ':nth-child(5) > .card-body > :nth-child(2) > form > .btn');
        });
    });
    cy.get(':nth-child(3)').its('length').then($length => {
        const rows = ($length - 1)/3 - 1;
        cy.get(`:nth-child(${rows}) > .card > .card-body > :nth-child(2) > form > .mb-3 > [data-testid=type]`).invoke('val').should(text => {
            expect(text).to.eq(deliverable.toString());
        });;
    });
});

When('I submit deliverable {string} of course {string} with prof {string}', (deliverable, course, prof) => {
    cy.click_button('My courses', ':nth-child(2) > .nav-link');
    cy.get('tr').its('length').then($length => {
        const rows = $length - 1;
        cy.click_button(course, `tbody > :nth-child(${rows}) > :nth-child(2) > a`);
        cy.get('.h3').should('have.text', 'Deliverables');
        cy.get(':nth-child(1) > .card-body > :nth-child(3)').invoke('val').should(text => {
            expect(text).to.eq(deliverable.toString());
        });
        cy.get(':nth-child(1) > .card-body > :nth-child(1)').should('contain', 'Deliverable').click();
        cy.get('.h2').should('have.text', 'Edit your submission');
        cy.get('[data-testid=due-date]').should('contain', 'This deliverable is due on the');
        cy.get('label').should('have.text', 'Submission file');
        const file = 'example.json';
        cy.get('[data-testid=file').attachFile(file);
        cy.click_button('Upload submission', '.btn');
    });
});

When('I submit the grade {int}', grade => {
    cy.get('tbody > tr > :nth-child(4)').type(grade+"{enter}");
    cy.get('tbody > tr > :nth-child(2)').click();
});

Then('I fill in the fields with {int} as username and {string} as password', (username, password) => {
    cy.server();
    cy.route({
        method: 'POST',
        url: 'http://localhost:8081/login',
        response: 200
    }).as('login');
    cy.visit('http://localhost:8081/login');
    cy.get('input[type=text]').type(username).invoke('val').should(text => {
        expect(text).to.eq(username.toString());
    });
    cy.get('input[type=password]').type(password).invoke('val').should(text => {
        expect(text).to.eq(password);
    });
});

Then('I click on {string} button with tag {string}', (name, tag) => {
    cy.get(tag).should('have.text', name).and('not.be.disabled').click();
    cy.wait(200);
});

Then('I log out', () => {
    cy.log_out();
});

Then('I get an error message', () => {
    cy.get('.alert').should('have.text', 'login failed. Please check your password and user id.');
});

Then('I log in with valid credentials', () => {
    cy.log_in(1, 'admin');
});

Then('I fill in the information of the {string} course to be created with {int} capacity', (course, capacity) => {
    cy.get(':nth-child(1) > label').should('have.text', 'Course name');
    cy.get('[data-testid=name]').should('have.attr', 'placeholder', 'Some name').and('not.be.disabled');
    cy.get(':nth-child(2) > label').should('have.text', 'Course status');
    cy.get('[data-testid=status]').find('option').should('contain', 'Open').and('contain', 'Closed').and('contain', 'Cancelled');
    cy.get(':nth-child(3) > label').should('have.text', 'Course capacity');
    cy.get('[data-testid=capacity]').should('have.attr', 'placeholder', '200').and('not.be.disabled');
    cy.get('[data-testid=name]').type(course);
    cy.get('[data-testid=capacity]').type(capacity);
    cy.click_button('Save changes', '.btn-primary');
});

Then('I fill in the name as {string}, the email as {string} and the birth date as {string} of the student to be created', (name, email, date) => {
    cy.get('[for="name"]').should('have.text', 'Student name');
    cy.get('[data-testid=name]').should('have.attr', 'placeholder', 'Some name').and('not.be.disabled');
    cy.get('[data-testid=name]').type(name);
    cy.get('[for="email"]').should('have.text', 'Student email');
    cy.get('[data-testid=email]').should('have.attr', 'placeholder', 'email@some.domain').and('not.be.disabled');
    cy.get('[data-testid=email]').type(email);
    cy.get('[for="admitted"]').should('have.text', 'Admitted');
    cy.get('[data-testid=admitted]').not('[disabled]').check();
    cy.get('[for="birthDate"]').should('have.text', 'Birth date');
    cy.get('.react-datepicker__input-container > .form-control').should('not.be.disabled');
    cy.get('input[name="birthDate"]').type('{selectall}'+date);
    cy.click_button('Save changes', '.btn-primary');
});

Then('I fill in the name as {string}, and the password as {string} of the prof to be created', (name, password) => {
    cy.get('.mb-3 > :nth-child(2)').should('have.text', 'Prof name');
    cy.get('[data-testid=name]').should('have.attr', 'placeholder', 'Some name').and('not.be.disabled');
    cy.get('[data-testid=name]').type(name);
    cy.get('.mb-3 > :nth-child(4)').should('have.text', 'Prof password');
    cy.get('[data-testid=password]').type(password);
    cy.click_button('Save changes', '.btn-primary');
});

Then('I schedule the last course created', () => {
    cy.get('tr').its('length').then(($length) => {
        const rows = $length - 1;
        cy.get(`:nth-child(${rows}) > th`).each($elem => {
            const course = $elem.text();
            cy.click_button('Edit', `:nth-child(5) > [href="/courses/${course}"]`);

            const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
            const hours = ['7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
                '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
                '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM'];
            cy.click_button('Add new slot', '.btn-secondary');
            cy.get('.form-row > :nth-child(1) > .form-control').find('option').each((item, index) => {
                cy.wrap(item).should('contain.text', weekdays[index]);
            });
            cy.get('.form-row > :nth-child(2) > .form-control').find('option').each((item, index) => {
                cy.wrap(item).should('contain.text', hours[index]);
            });
            cy.get('.card-body > .btn').should('have.text', 'Delete slot').and('not.be.disabled');
            cy.click_button('Save changes', '.btn-primary');
            cy.click_button('Courses', ':nth-child(2) > .nav-link');
            cy.contains(`tbody > :nth-child(${rows}) > :nth-child(3)`, 'scheduled').should('be.visible');
        });
    });
});

Then('I unschedule the last course created', () => {
    cy.get('tr').its('length').then(($length) => {
        const rows = $length - 1;
        cy.get(`:nth-child(${rows}) > th`).each($elem => {
            const course = $elem.text();
            cy.click_button('Edit', `:nth-child(5) > [href="/courses/${course}"]`)

            cy.get('[data-testid=status]').select('Closed');
            cy.click_button('Save changes', '.btn-primary');
            cy.click_button('Courses', ':nth-child(2) > .nav-link');
            cy.contains(`tbody > :nth-child(${rows}) > :nth-child(3)`, 'unscheduled').should('be.visible');
        });
    });
});

Then('I see the {string} course in the course dashboard', course => {
    cy.click_button('Courses', ':nth-child(2) > .nav-link');
    cy.location('pathname').should('contain', 'courses');
    cy.contains('.h2', 'Available courses').should('be.visible');
    cy.get('.thead-dark > tr').should('be.visible');
    cy.get('.thead-dark > tr > :nth-child(1)').should('be.visible').and('have.text', '#');
    cy.get('.thead-dark > tr > :nth-child(2)').should('be.visible').and('have.text', 'Name');
    cy.get('.thead-dark > tr > :nth-child(3)').should('be.visible').and('have.text', 'Status');
    cy.get('.thead-dark > tr > :nth-child(4)').should('be.visible').and('have.text', 'Capacity');
    cy.get('.thead-dark > tr > :nth-child(5)').should('be.visible').and('have.text', 'Commands');
    cy.get('td').contains(course);
});

Then('I see the {string} course in My courses', course => {
    cy.click_button('My courses', ':nth-child(2) > .nav-link');
    cy.location('pathname').should('contain', 'courses');
    cy.contains('.h2', 'My courses').should('be.visible');
    cy.get('.thead-dark > tr').should('be.visible');
    cy.get('.thead-dark > tr > :nth-child(1)').should('be.visible').and('have.text', '#');
    cy.get('.thead-dark > tr > :nth-child(2)').should('be.visible').and('have.text', 'Name');
    cy.get('.thead-dark > tr > :nth-child(3)').should('be.visible').and('have.text', 'Commands');
    cy.get('td').contains(course);
});

Then('I see the student {string} in the student dashboard', name => {
    cy.click_button('Students', ':nth-child(3) > .nav-link');
    cy.location('pathname').should('contain', 'students');
    cy.contains('.h2', 'Available students').should('be.visible');
    cy.get('td').contains(name);
});

Then('I see the prof {string} in the prof dashboard', name => {
    cy.click_button('Profs', ':nth-child(4) > .nav-link');
    cy.location('pathname').should('contain', 'profs');
    cy.contains('.h2', 'Available profs').should('be.visible');
    cy.get('td').contains(name);
});

Then('I want to change capacity of the last course created to {int}', capacity => {
    cy.get('tr').its('length').then($length => {
        const rows = $length - 1;
        cy.get(`:nth-child(${rows}) > th`).each($elem => {
            const course = $elem.text();
            cy.click_button('Edit', `:nth-child(5) > [href="/courses/${course}"]`);
        });
        cy.get('[data-testid=capacity]').clear().type(capacity);
        cy.click_button('Save changes', '.btn-primary');
        cy.click_button('Courses', ':nth-child(2) > .nav-link');
        cy.contains(`tbody > :nth-child(${rows}) > :nth-child(4)`, capacity).should('be.visible');
    });
});

Then('I want to cancel the last course created', () => {
    cy.get('tr').its('length').then($length => {
        const rows = $length - 1;
        cy.click_button('Cancel', `:nth-child(${rows}) > :nth-child(5) > [data-testid="cancel-course"]`);
        cy.contains(`tbody > :nth-child(${rows}) > :nth-child(3)`, 'cancelled').should('be.visible');
    });
});

Then('I want to delete the last course created', () => {
    cy.get('tr').its('length').then($length => {
        const rows = $length - 1;
        cy.click_button('Delete', `:nth-child(${rows}) > :nth-child(5) > [data-testid="delete-course"]`);
        cy.get('tbody > :nth-child(' + rows + ')').should('not.exist');
    });
});

Then('I want to delete the last student created', () => {
    cy.get('tr').its('length').then($length => {
        const rows = $length - 1;
        cy.click_button('Delete', `:nth-child(${rows}) > :nth-child(5) > .ml-2`);
        cy.get('tbody > :nth-child(' + rows + ')').should('not.exist');
    });
});

Then('I want to delete the last prof created', () => {
    cy.get('tr').its('length').then($length => {
        const rows = $length - 1;
        cy.click_button('Delete', `:nth-child(${rows}) > :nth-child(3) > .ml-2`);
        cy.get('tbody > :nth-child(' + rows + ')').should('not.exist');
    });
});

Then('I fill in the form with {string} as name, {string} as email, {string} as birth date, and {string} as password', (name, email, birth, password) => {
    cy.get('[data-testid=name]').type(name);
    cy.get('[data-testid=email]').type(email);
    cy.get('input[name="birthDate"]').type('{selectall}' + birth);
    cy.get('[data-testid=password]').type(password);
    cy.click_button('Register', '.mt-4');
});

Then('The admin can see the application of student {string}', email => {
    cy.log_in(1, 'admin');
    cy.click_button('Students', ':nth-child(3) > .nav-link');
    cy.get('.h2').should('be.visible').and('have.text', 'Available students');
    cy.get('td').contains(email);
});

Then('The registration operation is successful', () => {
    cy.click_button('Register to a new course', '.btn');
    cy.get('.h2').should('be.visible').and('have.text', 'Available courses');
    cy.get('.thead-dark > tr').should('be.visible');
    cy.get('.thead-dark > tr > :nth-child(1)').should('be.visible').and('have.text', '#');
    cy.get('.thead-dark > tr > :nth-child(2)').should('be.visible').and('have.text', 'Name');
    cy.get('.thead-dark > tr > :nth-child(3)').should('be.visible').and('have.text', 'Select');

    cy.get('tr').its('length').then($length => {
        const rows = $length - 1;
        cy.get(`tbody > :nth-child(${rows}) > :nth-child(1)`).each($elem => {
            const course = $elem.text();
            cy.get(`[data-testid=check-${course}]`).not('[disabled]').check();
            cy.click_button('Register', '.btn');
            cy.click_button('My courses', ':nth-child(2) > .nav-link');
            cy.get(':nth-child(2) > > tr').its('length').then($length2 => {
                const rows2 = $length2 - 1;
                cy.get(`tbody > :nth-child(${rows2}) > :nth-child(1)`).should('be.visible').and('have.text', course);
            });
        });
    });
});

Then('The drop operation is successful', () => {
    cy.get(':nth-child(2) > > tr').its('length').then($length => {
        const rows = $length - 1;
        cy.get(`tbody > :nth-child(${rows}) > :nth-child(2)`).each($elem => {
            const course = $elem.text();
            cy.click_button('Drop', `tbody > :nth-child(${rows}) > :nth-child(5) > a:nth-child(2)`);
            cy.get('[data-testid=dropped-courses] > > tr').its('length').then(($length2) => {
                const rows2 = $length2 - 1;
                cy.get(`[data-testid=dropped-courses] > tbody > :nth-child(${rows2}) > :nth-child(2)`).should('be.visible').and('have.text', course);
            });
        });
    });
});

Then('I change deadlines to {string} successfully', date => {
    cy.get(':nth-child(1) > .react-datepicker-wrapper > .react-datepicker__input-container > .form-control').should('not.be.disabled').type('{selectall}'+date+'{enter}');
    cy.get(':nth-child(2) > .react-datepicker-wrapper > .react-datepicker__input-container > .form-control').should('not.be.disabled').type('{selectall}'+date+'{enter}');

    cy.click_button('Save changes', '.btn');
    cy.click_button('Courses', ':nth-child(2) > .nav-link');
    cy.click_button('Academic deadlines', ':nth-child(5) > .nav-link');

    cy.get(':nth-child(1) > .react-datepicker-wrapper > .react-datepicker__input-container > .form-control').invoke('val').should(text => {
        expect(text).to.eq(date.toString());
    });
    cy.get(':nth-child(2) > .react-datepicker-wrapper > .react-datepicker__input-container > .form-control').invoke('val').should(text => {
        expect(text).to.eq(date.toString());
    });
});

Then('I see the deliver of course {string}', course => {
    cy.click_button('My courses', ':nth-child(2) > .nav-link');
    cy.get('tr').its('length').then($length => {
        const rows = $length - 1;
        cy.click_button(course, `tbody > :nth-child(${rows}) > :nth-child(2) > a`);
        cy.get(':nth-child(1) > .card-body > :nth-child(1)').click();
        cy.get('.h4').should('have.text', 'Submitted file');
        cy.get('.col-md-9 > :nth-child(1) > :nth-child(2) > a').should('have.text', 'example.json');
        cy.get('[data-testid=submission-date]').should('contain', 'Was submitted');
        cy.get('.col-md-9 > :nth-child(1) > :nth-child(2) > div').should('contain', 'Not yet graded');
    });
});

Then('The student sees the grade {int} of course {string}', (grade, course) => {
    cy.log_in(223, 'test');
    cy.click_button('My courses', ':nth-child(2) > .nav-link');
    cy.get('tr').its('length').then($length => {
        const rows = $length - 1;
        cy.click_button(course, `tbody > :nth-child(${rows}) > :nth-child(2) > a`);
        cy.get(':nth-child(1) > .card-body > :nth-child(1)').click();
        cy.get('.col-md-9 > :nth-child(1) > :nth-child(2) > div').should('contain', grade);
    });
});

Then('The student sees the final grade of course {string}', course => {
    cy.log_in(223, 'test');
    cy.click_button('My courses', ':nth-child(2) > .nav-link');
    cy.get('tr').its('length').then($length => {
        const rows = $length - 1;
        cy.click_button(course, `tbody > :nth-child(${rows}) > :nth-child(2) > a`);
        cy.get('.col-md-9 > :nth-child(1) > :nth-child(2)').should('contain', 'Your grade is:');
    });
});
