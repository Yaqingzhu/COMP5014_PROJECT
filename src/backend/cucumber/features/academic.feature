Feature: testing for adademic deadlines

Scenario: test update/insert deadlines
Given a deadline json file "{\"registrationDeadline\": \"2020-11-12\",  \"dropDeadline\": \"2020-12-12\"}"
Then deadline get a response with responseCode 0

Scenario: test get deadlines
Given a request to get deadlines
Then get a response with registrationDeadline "2020-11-12", dropDeadline "2020-12-12"
