Feature: testing for course operation backend

Scenario: course insert
Given course json file "{\"courseId\": 1234,\"courseName\": \"Java1\",\"courseStatus\": \"scheduled\",\"courseCapacity\": 30}"
Then return a json with responseCode equals to 0

Scenario: course insert with course time slots
Given course json file "{\"courseId\": 12345,\"courseName\": \"Java2\",\"courseStatus\": \"scheduled\",\"courseCapacity\": 30, \"course_slots\": [{\"day\": 2 , \"time\": \"19:00\"},{\"day\": 3 , \"time\": \"19:00\"}]}"
Then return a json with responseCode equals to 0
Then time_slots table has a row with course id 12345 and day 2


