Feature: Specific scenario testing
  Scenario: Advanced use case
    # Admin creates a term and its deadlines;
    #S1 requests creation; Admin creates C2;
    #P1 and P2 'simultaneously' request creation;
    #Admin creates C1; Admin creates C3;
    #S2 and S3 'simultaneously' request creation;
    #Admin assigns C1 to P1; assigns C3 to P2; assigns C2 to P1;
    #S2 logins in, then S3, then S1; then P1; then P2;
    #S2 and S3 'simultaneous register in C1;
    #S1 registers in C2; S1 registers in C3; S2 registers in C3;
    #P1 creates deliverable Project for C1; P2 creates deliverable Essay for C3;
    #S1 drops C2;
    #S2 and S3 'simultaneously' submit Project in C1;
    #S1 submits Essay in C3, S2 submits Essay in C3;
    #P1 submits marks for Project in C1;
    #P2 submit marks for Essay in C3;
    #Simultaneously P1 and P2 submit final grades respectively for C1 and C3
    #S1, S2, S3, P1 and P2 log out
    Given admin is logged in
    And   a term with deadlines is created
    When student 1 requests creation with this payload "{\"email\": \"test1@carleton.ca\",\"birthDate\": \"2020-09-10\",\"name\": \"test1\",\"password\": \"1234\"}"
    And  course 1 is created with this payload "{\"courseName\": \"Test1\",\"courseStatus\": \"scheduled\",\"courseCapacity\": 2}"
    And  prof 1 and prof 2 are created with this payload "[{\"profName\": \"test1\",\"password\": \"1234\"},{\"profName\": \"test2\",\"password\": \"1234\"}]"
    And  course 2 is created with this payload "{\"courseName\": \"Test2\",\"courseStatus\": \"scheduled\",\"courseCapacity\": 2}"
    And  course 3 is created with this payload "{\"courseName\": \"Test3\",\"courseStatus\": \"scheduled\",\"courseCapacity\": 2}"
    And  student 2 and student 3 request creation with this payload "[{\"email\": \"test2@carleton.ca\",\"birthDate\": \"2020-09-10\",\"name\": \"test2\",\"password\": \"1234\"},{\"email\": \"test3@carleton.ca\",\"birthDate\": \"2020-09-10\",\"name\": \"test3\",\"password\": \"1234\"}]"
    And  prof 1 is assigned to course 1
    And  prof 1 is assigned to course 2
    And  prof 2 is assigned to course 3
    And  all students are admitted
    And  all users log in
    And  student 2 and student 3 register into course 1
    And  student 1 registers into course 2
    And  student 1 registers into course 3
    And  student 2 registers into course 3
    And  prof 1 creates deliverable 1 for course 1 with this payload "{\"deliverableType\": \"Project\",\"deliverableDeadline\":\"2020-09-10\"}"
    And  prof 2 creates deliverable 2 for course 3 with this payload "{\"deliverableType\": \"Essay\",\"deliverableDeadline\":\"2020-09-10\"}"
    And  student 1 drops course 2
    And  student 2 and student 3 submit a file for deliverable 1
    And  student 1 and student 2 submit a file for deliverable 2
    And  prof 1 submits marks for deliverable 1
    And  prof 2 submits marks for deliverable 2
    And  prof 1 and prof 2 submit final grades for course 1 and course 3
    And  all users log out
    Then the scenario completed successfully
