Feature: testing for submission related operations

  Scenario: student creates a submission
    Given a student with this payload "{\"email\": \"yaqing@carleton.ca\",\"birthDate\": \"2020-09-10\",\"name\": \"Yaqing\",\"password\": \"test\"}" exists
    And   the student is registered in course 123
    And   a deliverable with this payload "{\"courseId\": \"123\",\"deliverableType\": \"test\",\"deliverableDeadline\":\"2020-09-10\"}" exists
    When the student submits a file for the deliverable
    Then  the submission return a json with responseCode equals to 0

  Scenario: a student gets a submission
    Given a student with this payload "{\"email\": \"yaqing@carleton.ca\",\"birthDate\": \"2020-09-10\",\"name\": \"Yaqing\",\"password\": \"test\"}" exists
    And   the student is registered in course 123
    And   a deliverable with this payload "{\"courseId\": \"123\",\"deliverableType\": \"test\",\"deliverableDeadline\":\"2020-09-10\"}" exists
    When the student submits a file for the deliverable
    And  the student requests a submission
    Then  the submission return a json with responseCode equals to 0

  Scenario: a student gets all submission
    Given a student with this payload "{\"email\": \"yaqing@carleton.ca\",\"birthDate\": \"2020-09-10\",\"name\": \"Yaqing\",\"password\": \"test\"}" exists
    And   the student is registered in course 123
    And   a deliverable with this payload "{\"courseId\": \"123\",\"deliverableType\": \"test\",\"deliverableDeadline\":\"2020-09-10\"}" exists
    When the student submits a file for the deliverable
    And  the student requests all submissions
    Then  the submission return a json with responseCode equals to 0