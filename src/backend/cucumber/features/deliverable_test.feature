Feature: testing for deliverable related operations

  Scenario: get a deliverable
    Given a request to fetch a deliverable with this payload "{\"deliverableId\":\"1\"}"
    Then return a json with response code equals to 0

  Scenario: get all deliverables for a course
    Given a request to fetch deliverables for a course with this payload "{\"courseId\":\"123\"}"
    Then return a json with response code equals to 0

  Scenario: create deliverable
    Given "create" a deliverable with this payload "{\"courseId\": \"123\",\"deliverableType\": \"test\",\"deliverableDeadline\":\"2020-09-10\"}"
    Then return a json with response code equals to 0

  Scenario: update deliverable
    Given "update" a deliverable with this payload "{\"deliverableId\": \"1\",\"deliverableType\": \"test\",\"deliverableDeadline\":\"2020-09-10\"}"
    Then return a json with response code equals to 0

  Scenario: delete a deliverable
    Given "delete" a deliverable with this payload "{\"deliverableId\": \"1\"}"
    Then return a json with response code equals to 0