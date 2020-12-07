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
    Then I fill in the information of the "CompGeom" course to be created with 30 capacity
    And I see the "CompGeom" course in the course dashboard

  Scenario: I register on a course
    Given I log in with valid student credentials
    And I click on "My courses" button with tag ":nth-child(2) > .nav-link"
    When I see the courses page
    Then The registration operation is successful

  Scenario: I drop a course
    Given I log in with valid student credentials
    And I click on "My courses" button with tag ":nth-child(2) > .nav-link"
    When I see the courses page
    Then The drop operation is successful

  Scenario: I update a course information
    Given I log in with valid credentials
    When I click on "Courses" button with tag ":nth-child(2)>.nav-link"
    And I see the "CompGeom" course in the course dashboard
    Then I want to change capacity of the last course created to 20

  Scenario: I cancel a course
    Given I log in with valid credentials
    When I click on "Courses" button with tag ":nth-child(2)>.nav-link"
    And I see the "CompGeom" course in the course dashboard
    Then I want to cancel the last course created
    
  Scenario: I create academic deadlines
    Given I log in with valid credentials
    When I click on "Academic deadlines" button with tag ":nth-child(5)>.nav-link"
    Then I see "Academic deadlines" in a ".h2" tag
    And I see "Deadlines for registration" in a ":nth-child(1) > label" tag
    And I see "Deadlines for dropping courses" in a ":nth-child(2) > label" tag
    And I change deadlines to "12/25/2020" successfully

  Scenario: I delete a course
    Given I log in with valid credentials
    When I click on "Courses" button with tag ":nth-child(2)>.nav-link"
    And I see the "CompGeom" course in the course dashboard
    Then I want to delete the last course created

  Scenario: Student apply for registration
    Given I am a student without account
    When I see the registration page
    Then I fill in the form with "Student1" as name, "student1@carleton.ca" as email, "11/29/1999" as birth date, and "student1" as password
    And The admin can see the application of student "student1@carleton.ca"

  Scenario: I create a student
    Given I log in with valid credentials
    When I click on "Students" button with tag ":nth-child(3)>.nav-link"
    And I see "Available students" in a ".h2" tag
    And I click on "New student" button with tag ".btn"
    And I see "New student" in a "h1.mb-3" tag
    Then I fill in the name as "Student2", the email as "student2@test.ca" and the birth date as "11/20/1990" of the student to be created
    And I see the student "Student2" in the student dashboard

  Scenario: I delete a student
    Given I log in with valid credentials
    When I click on "Students" button with tag ":nth-child(3)>.nav-link"
    And I see the students in a table
    Then I want to delete the last student created

  Scenario: I schedule a course
    Given I log in with valid credentials
    When I click on "Courses" button with tag ":nth-child(2)>.nav-link"
    And I create the course "Course1" with capacity 20
    And I see the "Course1" course in the course dashboard
    Then I schedule the last course created

  Scenario: I unschedule a course
    Given I log in with valid credentials
    When I click on "Courses" button with tag ":nth-child(2)>.nav-link"
    And I create the course "Course2" with capacity 20
    And I see the "Course2" course in the course dashboard
    Then I unschedule the last course created

  Scenario: I create a prof
    Given I log in with valid credentials
    When I click on "Profs" button with tag ":nth-child(4)>.nav-link"
    And I see "Available profs" in a ".h2" tag
    And I click on "New prof" button with tag ".btn"
    And I see "New prof" in a "h1.mb-3" tag
    Then I fill in the name as "Prof3", and the password as "prof2" of the prof to be created
    And I see the prof "Prof3" in the prof dashboard

  Scenario: I assign a prof to a course
    Given I log in with valid credentials
    When I click on "Courses" button with tag ":nth-child(2)>.nav-link"
    And I create the course "Course2" with capacity 20
    And I assign prof "Prof3" to the last course created
    Then I log in with valid prof credentials
    And I click on "My courses" button with tag ":nth-child(2) > .nav-link"
    And I see the "Course2" course in My courses

  Scenario: I create a deliverable
    Given I log in with valid prof credentials
    When I click on "My courses" button with tag ":nth-child(2) > .nav-link"
    Then I create the deliverable "Project1" for the last of my courses

  Scenario: I submit a deliverable
     Given The deliverable "Project1" of course "Course" with prof "prof" is created
     And I log in with valid student credentials
     And I register on a course
     When I submit deliverable "Project1" of course "Course" with prof "prof"
     Then I see the deliver of course "Course"
     
  Scenario: I delete a prof
    Given I log in with valid credentials
    When I click on "Profs" button with tag ":nth-child(4)>.nav-link"
    And I see the profs in a table
    Then I want to delete the last prof created
