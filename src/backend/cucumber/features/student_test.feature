Feature: testing for student related operations

Scenario: student apply for creation
Given a student want to apply for creation with this payload "{\"email\": \"yaqing@carleton.ca\",\"birthDate\": \"2020-09-10\",\"name\": \"Yaqing\",\"password\": \"1234\"}"
Then return a json with admitted equals to 0

Scenario: student register course
Given a student 223 want to register course "{\"studentId\": 223,\"courseId\": 123}"
Then course return a json with responseCode equals to 0

Scenario: student drop course
Given a student 223 want to drop course "{\"studentId\": 223,\"courseId\": 123}"
Then course return a json with responseCode equals to 0

Scenario: pending student register course
Given a pending student want to register course "{\"studentId\": 2234,\"courseId\": 123}"
Then course return a json with responseCode equals to -1

Scenario: student register course late
Given a student 22345 want to late register course "{\"studentId\": 22345,\"courseId\": 123}"
Then course return a json with error message contains "missed the deadline" 

Scenario: student drop course late
Given a student 22345 want to late drop course "{\"studentId\": 22345,\"courseId\": 123}"
Then course return a json with error message contains "missed the deadline" 

Scenario: student list all registered courses
Given a student 223 want to list courses "{\"studentId\": 223}"
Then course return a json with payload contains course 123