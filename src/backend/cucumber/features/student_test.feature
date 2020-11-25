Feature: testing for student related operations

Scenario: student apply for creation
Given a student want to apply for creation with this payload "{\"email\": \"yaqing@carleton.ca\",\"birthDate\": \"2020-09-10\",\"name\": \"Yaqing\",\"password\": \"1234\"}"
Then return a json with admitted equals to 0

Scenario: student register course
Given a student want to register course "{\"studentId\": 123,\"courseId\": 123}"
Then return a json with responseCode equals to 0

Scenario: student drop course
Given a student want to drop course "{\"studentId\": 123,\"courseId\": 123}"
Then return a json with responseCode equals to 0

Scenario: pending student register course
Given a student want to register course "{\"studentId\": 1234,\"courseId\": 123}"
Then return a json with responseCode equals to -1

Scenario: student register course late
Given a student want to register course "{\"studentId\": 12345,\"courseId\": 123}"
Then return a json with error message contains "missed the deadline" 

Scenario: student drop course late
Given a student want to drop course "{\"studentId\": 12345,\"courseId\": 123}"
Then return a json with error message contains "missed the deadline" 

Scenario: student list all registered courses
Given a student want to drop course "{\"studentId\": 123}"
Then return a json with payload contains course "123" 