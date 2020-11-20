Feature: testing for course operation backend

# create this Scenario to 
Scenario: start server can be correct
Given start server
Then no error 

Scenario: course insert
Given course json file "{\"courseId\": 1234,\"courseName\": \"Java1\",\"courseStatus\": \"scheduled\",\"courseCapacity\": 30}"
Then return a json with responseCode equals to 0

Scenario: course insert with course time slots
Given course json file "{\"courseId\": 12345,\"courseName\": \"Java2\",\"courseStatus\": \"scheduled\",\"courseCapacity\": 30, \"course_slots\": [{\"day\": 2 , \"time\": \"19:00\"},{\"day\": 3 , \"time\": \"19:00\"}]}"
Then return a json with responseCode equals to 0
Then time_slots table has a row with course id 12345 and day 2

Scenario: course insert with preclusions
Given course json file "{\"courseId\": 123456,\"courseName\": \"Java3\",\"courseStatus\": \"scheduled\",\"courseCapacity\": 30, \"preclusions\":[234]}"
Then return a json with responseCode equals to 0 
Then preclusions table has a row with course id 123456 and preclusions 234

Scenario: course insert with prerequisites
Given course json file "{\"courseId\": 1234567,\"courseName\": \"Java4\",\"courseStatus\": \"scheduled\",\"courseCapacity\": 30, \"prerequisites\":[1234]}"
Then return a json with responseCode equals to 0 
Then prerequisites table has a row with course id 1234567 and prerequisites 1234

Scenario: course update with new course name
Given course json file "{\"courseId\": 123456,\"courseName\": \"Java IV\",\"courseStatus\": \"scheduled\",\"courseCapacity\": 30}"
Then return a json with responseCode equals to 0 
Then course table has a row with course id 123456 and course name "Java IV"

Scenario: course delete 
Given course json file "{\"courseId\": 123456,\"courseName\": \"Java IV\",\"courseStatus\": \"deleted\",\"courseCapacity\": 30}"
Then return a json with responseCode equals to 0 
Then course table has a row with course id 123456 and course status "deleted"

Scenario: course unschedule 
Given course json file "{\"courseId\": 123456,\"courseName\": \"Java IV\",\"courseStatus\": \"unschedule\",\"courseCapacity\": 30}"
Then return a json with responseCode equals to 0 
Then course table has a row with course id 123456 and course status "unschedule"

Scenario: course cancel 
Given course json file "{\"courseId\": 123456,\"courseName\": \"Java IV\",\"courseStatus\": \"cancel\",\"courseCapacity\": 30}"
Then return a json with responseCode equals to 0 
Then course table has a row with course id 123456 and course status "cancel"

Scenario: course update prerequisites
Given course json file "{\"courseId\": 12345,\"courseName\": \"Java4\",\"courseStatus\": \"scheduled\",\"courseCapacity\": 30, \"prerequisites\":[1234]}"
Then return a json with responseCode equals to 0 
Then prerequisites table has a row with course id 12345 and prerequisites 1234

Scenario: course update without login
Given without login, course json file "{\"courseId\": 12345,\"courseName\": \"Java4\",\"courseStatus\": \"scheduled\",\"courseCapacity\": 30, \"prerequisites\":[1234]}"
Then return a json with responseCode equals to -1 
