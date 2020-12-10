/* eslint-disable no-lone-blocks */
const { Given, When, Then, AfterAll, BeforeAll } = require('cucumber');
const assert = require('assert').strict;
const mysql = require('../../db_util');
const http = require('http');
const app = require('../../index');
const session = require('supertest-session');

let server;

let adminSession = null;
let students = {};
let courses = {};
let profs = {};
let deliverables = {};
let submissions = [];

const deadlines = {
  registrationDeadline: '2020-11-12',
  dropDeadline: '2020-12-12',
};
const grade = 50.0;

BeforeAll(() => {
  server = http.createServer(app);
});

AfterAll(() => {
  server.close();
  mysql.getDBConnection().destroy();

  adminSession = null;
  students = {};
  courses = {};
  profs = {};
  deliverables = {};
  submissions = [];
});

Given('admin is logged in', function () {
  const testSession = session(app);
  return testSession
    .post('/login')
    .send({ id: 1, password: 'admin' })
    .expect(200)
    .then(function () {
      adminSession = testSession;
    });
});

Given('a term with deadlines is created', function () {
  return adminSession
    .post('/updateacademicline')
    .send(deadlines)
    .expect(200);
});

When('student {int} requests creation with this payload {string}', function (studentIndex, payload) {
  const studentPayload = JSON.parse(payload);

  return session(app)
    .post('/applycreatestudent')
    .send(studentPayload)
    .expect(200)
    .then(function (response) {
      students[studentIndex] = {
        ...studentPayload,
        studentName: studentPayload.name,
        studentEmail: studentPayload.email,
        studentId: response.body.studentId,
      };
    });
});

When('course {int} is created with this payload {string}', function (courseIndex, payload) {
  return adminSession
    .post('/courseop')
    .send(JSON.parse(payload))
    .expect(200)
    .then(function (response) {
      courses[courseIndex] = {
        ...JSON.parse(payload),
        courseId: JSON.parse(response.body.coursePayload).courseId,
      };
    });
});

When('prof {int} and prof {int} are created with this payload {string}', function (prof1Index, prof2Index, payload) {
  const profPayload = JSON.parse(payload);

  return Promise.all(
    [
      adminSession
        .post('/createprof')
        .send(profPayload[0])
        .expect(200)
        .then(function (response) {
          profs[prof1Index] = {
            ...profPayload[0],
            profId: response.body.profId,
          };
        }),
      adminSession
        .post('/createprof')
        .send(profPayload[1])
        .expect(200)
        .then(function (response) {
          profs[prof2Index] = {
            ...profPayload[1],
            profId: response.body.profId,
          };
        }),
    ]
  );
});

When('student {int} and student {int} request creation with this payload {string}', function (student1Index, student2Index, payload) {
  const studentPayload = JSON.parse(payload);

  return Promise.all(
    [
      session(app)
        .post('/applycreatestudent')
        .send(studentPayload[0])
        .expect(200)
        .then(function (response) {
          students[student1Index] = {
            ...studentPayload[0],
            studentName: studentPayload[0].name,
            studentEmail: studentPayload[0].email,
            studentId: response.body.studentId,
          };
        }),
      session(app)
        .post('/applycreatestudent')
        .send(studentPayload[1])
        .expect(200)
        .then(function (response) {
          students[student2Index] = {
            ...studentPayload[1],
            studentName: studentPayload[1].name,
            studentEmail: studentPayload[1].email,
            studentId: response.body.studentId,
          };
        }),
    ]
  );
});

When('prof {int} is assigned to course {int}', function (profIndex, courseIndex) {
  return adminSession
    .post('/assignprof')
    .send({
      courseId: courses[courseIndex].courseId,
      profId: profs[profIndex].profId,
    })
    .expect(200)
    .then(function () {
      courses[courseIndex] = {
        ...courses[courseIndex],
        assignedProf: profs[profIndex].profId,
      };
    });
});

When('all students are admitted', function () {
  return Promise.all(
    Object.values(students).map(student => {
      return adminSession
        .post('/modifystudent')
        .send({
          ...student,
          admitted: true,
        })
        .expect(200)
        .then(function () {
          student.admitted = 1;
        });
    }),
  );
});

When('all users log in', function () {
  return Promise.all(
    [
      ...Object.values(students).map(student => {
        const currentSession = session(app);
        return currentSession
          .post('/login')
          .send({
            id: student.studentId,
            password: student.password,
          })
          .expect(200)
          .then(function () {
            student.session = currentSession;
          });
        }),
      ...Object.values(profs).map(prof => {
        const currentSession = session(app);
        return currentSession
          .post('/login')
          .send({
            id: prof.profId,
            password: prof.password,
          })
          .expect(200)
          .then(function () {
            prof.session = currentSession;
          });
        }),
    ],
  );
});

When('student {int} and student {int} register into course {int}', function (student1Index, student2Index, courseIndex) {
  return Promise.all(
    [
      students[student1Index].session
        .post('/registercourse')
        .send({
          studentId: students[student1Index].studentId,
          courseId: courses[courseIndex].courseId,
        })
        .expect(200)
        .then(reponse => {
          students[student1Index].registrationId = reponse.body.registrationId;
        }),
      students[student2Index].session
        .post('/registercourse')
        .send({
          studentId: students[student2Index].studentId,
          courseId: courses[courseIndex].courseId,
        })
        .expect(200)
        .then(reponse => {
          students[student2Index].registrationId = reponse.body.registrationId;
        }),
    ]
  );
});

When('student {int} and student {int} fail to both register into course {int}', function (student1Index, student2Index, courseIndex) {
  return Promise.all(
    [
      students[student1Index].session
        .post('/registercourse')
        .send({
          studentId: students[student1Index].studentId,
          courseId: courses[courseIndex].courseId,
        })
        .then(response => {
          if (response.statusCode === 200) {
            students[student1Index].registrationId = response.body.registrationId;
          }
        }),
      students[student2Index].session
        .post('/registercourse')
        .send({
          studentId: students[student2Index].studentId,
          courseId: courses[courseIndex].courseId,
        })
        .then(response => {
          if (response.statusCode === 200) {
            students[student2Index].registrationId = response.body.registrationId;
          }
        }),
    ]
  );
});

When('student {int} registers into course {int}', function (studentIndex, courseIndex) {
  return students[studentIndex].session
    .post('/registercourse')
    .send({
      studentId: students[studentIndex].studentId,
      courseId: courses[courseIndex].courseId,
    })
    .expect(200)
    .then(reponse => {
      students[studentIndex].registrationId = reponse.body.registrationId;
    });
});

When('prof {int} creates deliverable {int} for course {int} with this payload {string}', function (profIndex, deliverableIndex, courseIndex, payload) {
  return profs[profIndex].session
    .post('/createdeliverable')
    .send({
      ...JSON.parse(payload),
      courseId: courses[courseIndex].courseId,
    })
    .expect(200)
    .then(response => {
      deliverables[deliverableIndex] = {
        ...JSON.parse(payload),
        courseId: courses[courseIndex].courseId,
        deliverableId: response.body.deliverableId,
      };
    });
});

When('student {int} drops course {int}', function (studentIndex, courseIndex) {
  return students[studentIndex].session
    .post('/dropcourse')
    .send({
      studentId: students[studentIndex].studentId,
      courseId: courses[courseIndex].courseId,
    })
    .expect(200);
});

When('student {int} and student {int} submit a file for deliverable {int}', function (student1Index, student2Index, deliverableIndex) {
  return Promise.all(
    [
      students[student1Index].session
        .post('/submitdeliverable')
        .attach('submission', Buffer.from('some data'), 'custom_file_name.txt')
        .field('registrationId', students[student1Index].registrationId)
        .field('deliverableId', deliverables[deliverableIndex].deliverableId)
        .expect(200)
        .then(response => {
          submissions.push({
            registrationId: students[student1Index].registrationId,
            deliverableId: deliverables[deliverableIndex].deliverableId,
            submissionId: response.body.submission.submissionId,
          });
        }),
      students[student2Index].session
        .post('/submitdeliverable')
        .attach('submission', Buffer.from('some data'), 'custom_file_name.txt')
        .field('registrationId', students[student2Index].registrationId)
        .field('deliverableId', deliverables[deliverableIndex].deliverableId)
        .expect(200)
        .then(response => {
          submissions.push({
            registrationId: students[student2Index].registrationId,
            deliverableId: deliverables[deliverableIndex].deliverableId,
            submissionId: response.body.submission.submissionId,
          });
        }),
    ]
  );
});

When('prof {int} submits marks for deliverable {int}', function (profIndex, deliverableIndex) {
  return Promise.all(
    submissions
      .filter(submission => submission.deliverableId !== deliverables[deliverableIndex].deliverableId)
      .map(submission => profs[profIndex].session
        .post('/gradesubmission')
        .send({
          submissionId: submission.submissionId,
          grade,
        })
        .expect(200)
        .then(() => {
          submissions.find(element => element.submissionId === submission.submissionId).submissionGrade = grade;
        })
      ),
  );
});

When('prof {int} and prof {int} submit final grades for course {int} and course {int}', function (prof1Index, prof2Index, course1Index, course2Index) {
  return Promise.all(
    [
      profs[prof1Index].session
        .post('/submitfinalgrade')
        .send({
          courseId: courses[course1Index].courseId,
        })
        .expect(200)
        .then(() => {
          courses[course1Index].grade = grade;
        }),
      profs[prof2Index].session
        .post('/submitfinalgrade')
        .send({
          courseId: courses[course2Index].courseId,
        })
        .expect(200)
        .then(() => {
          courses[course2Index].grade = grade;
        }),
    ]
  );
});

When('all users log out', function () {
  return Promise.all(
    [
      ...Object.values(students).map(student => {
        return student.session
          .post('/logout')
          .send({
            id: student.studentId,
            password: student.password,
          })
          .expect(200)
          .then(function () {
            student.session = null;
          });
      }),
      ...Object.values(profs).map(prof => {
        return prof.session
          .post('/logout')
          .send({
            id: prof.profId,
            password: prof.password,
          })
          .expect(200)
          .then(function () {
            prof.session = null;
          });
      }),
    ],
  );
});

Then('the scenario completed successfully', async () => {
  let response = await adminSession
    .get('/academicline')
    .send();

  assert.equal(true, response.body.registrationDeadline.includes(deadlines.registrationDeadline));
  assert.equal(true, response.body.dropDeadline.includes(deadlines.dropDeadline));

  response = await adminSession
    .get('/students')
    .send();

  Object.values(students).forEach(student => {
    const found = response.body.students.find(element => element.studentId === student.studentId);

    assert.notEqual(found, undefined);
    assert.equal(found.studentName, student.studentName);
    assert.equal(found.studentEmail, student.studentEmail);
    assert.equal(found.admitted, student.admitted);
  });

  response = await adminSession
    .get('/profs')
    .send();

  Object.values(profs).forEach(prof => {
    const found = response.body.profs.find(element => element.profId === prof.profId);

    assert.notEqual(found, undefined);
    assert.equal(found.profName, prof.profName);
  });

  response = await adminSession
    .get('/course')
    .send();

  const foundCourses = response.body.coursePayload.map(val => JSON.parse(val.result));
  await Promise.all(Object.values(courses).map(async course => {
    const found = foundCourses.find(element => element.courseId === course.courseId);

    assert.notEqual(found, undefined);
    assert.equal(found.assignedProf, course.assignedProf);

    const registrationsResponse = await adminSession
      .get('/coursestudents')
      .query({
        courseId: course.courseId,
      });

    registrationsResponse.body.students.forEach(registration => {
      const sub = submissions.find(element => element.registrationId === registration.registrationId);

      if (sub) {
        assert.equal(sub.submissionGrade, parseFloat(registration.finalGrade));
      }
    });
  }));

  await Promise.all(Object.values(deliverables).map(async deliverable => {
    const response = await adminSession
      .get('/deliverable')
      .query({
        deliverableId: deliverable.deliverableId,
      });

    assert.equal(response.body.deliverable.deliverableType, deliverable.deliverableType);
    assert.equal(response.body.deliverable.courseId, deliverable.courseId);
  }));

  await Promise.all(submissions.map(async submission => {
    const response = await adminSession
      .get('/submission')
      .query({
        deliverableId: submission.deliverableId,
        registrationId: submission.registrationId,
      });

    assert.equal(response.body.submission.submissionGrade, grade);
  }));
});

Then('one student could not register into course {int}', async courseIndex => {
  const registrationsResponse = await adminSession
    .get('/coursestudents')
    .query({
      courseId: courses[courseIndex].courseId,
    });

  assert.equal(registrationsResponse.body.students.length, 2);
});

Then('all students could register into course {int}', async courseIndex => {
  const registrationsResponse = await adminSession
    .get('/coursestudents')
    .query({
      courseId: courses[courseIndex].courseId,
    });

  // Does not include the dropped student
  assert.equal(registrationsResponse.body.students.length, 2);
});
