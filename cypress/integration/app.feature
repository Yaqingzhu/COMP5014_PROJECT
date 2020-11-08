Feature: Hello, World! App
  I want to see a Hello, World! message from the API

  Scenario: Opening the main page
    Given I open the "/" page
    And   I wait for the api to respond
    Then I see "Hello World!" in a "h1" tag
