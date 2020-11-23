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
    And I click on Login button
