Feature: testing for student related operations

Scenario: student apply for creation
Given a student want to apply for creation with this payload "{\"email\": \"yaqing@carleton.ca\",\"birthDate\": \"2020-09-10\",\"name\": \"Yaqing\",\"password\": \"1234\"}"
Then return a json with admitted equals to 0