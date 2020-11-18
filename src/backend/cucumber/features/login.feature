Feature: testing for login backend

Scenario: happy path
Given a user id set to 123 and password set to "t"
Then return a json with "loginStatus" equals to 0

Scenario: wrong user id and password combination first and correct combination then
Given a user id set to 123 and password set to "t123"
Then return a json with "loginStatus" equals to -1
Given a user id set to 123 and password set to "t"
Then return a json with "loginStatus" equals to 0

Scenario: too many failed re-tries
Given a user id set to 123 and password set to "t123"
Then return a json with "loginStatus" equals to -1
Then re-try this for 4 times a user id set to 123 and password set to "t123"
Then return a json with "loginStatus" equals to -2

Scenario Outline: wrong user id and password combination
Given a user id set to <var_id> and password set to <var_password>
Then return a json with "loginStatus" equals to -1

Examples:
    | var_id | var_password   | 
    | 100    |         "5"      |
    |  436345|      "asdd"      |
    |  23556 |   "select * from login"   |