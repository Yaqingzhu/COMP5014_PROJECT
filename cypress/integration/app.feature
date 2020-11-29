Feature: Placeholder Test
  I want to see the Login page for this placeholder test

  Scenario: Opening the main page and Login in
    Given I open the "/" page
    When I see a page
    And I see logo image in a ".img-fluid" tag
    And I see "Please sign in" in a ".title" tag
    And I see "Login" in a ".mt-4" tag
    And I see "Email" to fill in "[type=text]" tag
    And I see "Password" to fill in "[type=password]" tag
    Then I fill in the fields with 1 as username and "admin" as password
    And I click on "Login" button with tag ".mt-4"
    And I see "Hello, World!" in a "h1" tag
    And I log out

  Scenario: I log in after one retry
    Given I use 2 as username and "admin" as password
    Then I get an error message
    And I log in with valid credentials
    And I log out

  Scenario: I create a course
    Given I log in with valid credentials
    When I click on "Courses" button with tag ":nth-child(2)>.nav-link"
    And I see "Available courses" in a ".h2" tag
    And I click on "New course" button with tag ".btn"
    And I see "New course" in a "h1.mb-3" tag
    Then I fill in with the information of the course to be created
    And I can add a schedule for the course
    And I see the course in the course dashboard

  Scenario: I update a course information
    Given I log in with valid credentials
    When I click on "Courses" button with tag ":nth-child(2)>.nav-link"
    And I see the courses in a table
    Then I want to change capacity of the last course created to 20

  Scenario: I delete a course
    Given I log in with valid credentials
    When I click on "Courses" button with tag ":nth-child(2)>.nav-link"
    And I see the courses in a table
    Then I want to delete the last course created

  Scenario: I create a student
    Given I am a student without account
    When I see the registration page
    Then I fill in the form with "Student1" as name, "student1@carleton.ca" as email, "11/29/1999" as birth date, and "student1" as password
    And The admin can see the application of student "student1@carleton.ca"
