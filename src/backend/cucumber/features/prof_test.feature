Feature: testing for prof related operations

Scenario: create prof
Given "create" a prof with this payload "{\"name\": \"Yaqing\",\"password\": \"1234\"}"
Then return a json with response equals to 0

Scenario: update prof
Given "update" a prof with this payload "{\"name\": \"Yaqing2\",\"password\": \"12345\"}"
Then return a json with response equals to 0

Scenario: delete prof
Given "delete" a prof with this payload ""
Then return a json with response equals to 0