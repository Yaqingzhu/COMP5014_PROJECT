Feature: testing for general_apis

Scenario: test session role vaildation
Given a session role is "admin"
Then vaildation for admin is 1 for student is 0 for prof is 0

Scenario: test session role vaildation
Given a session role is "student"
Then vaildation for admin is 0 for student is 1 for prof is 0

Scenario: test session role vaildation
Given a session role is "prof"
Then vaildation for admin is 0 for student is 0 for prof is 1

Scenario: test login session vaildation
Given a session login is 1
Then vaildation login is 1

Scenario: test login session vaildation
Given a session login is 0
Then vaildation login is 0