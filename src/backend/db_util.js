const mysql = require('mysql');
const fs = require('fs');

// Environment variables for the database
const { DB_PORT, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;

let connection = null;

function getDBConnection() {
  if (!connection) {
    connection = mysql.createConnection({
      port: DB_PORT || 3306,
      host: DB_HOST || '127.0.0.1',
      user: DB_USERNAME || 'root',
      password: DB_PASSWORD || 'comp4004',
      database: DB_DATABASE || 'comp4004',
      // allow multiple line statements in one query
      multipleStatements: true,
    });
  }
  return connection;
}

function checkUserRole(resolve, reject, userId) {
  const connection = getDBConnection();
  connection.query('UPDATE login SET failed_time = 0 WHERE id =?', [
    userId
  ]);
  connection.query('SELECT 1 AS result, admin_name AS name FROM admin WHERE admin_id = ? UNION SELECT 2 AS result, prof_name AS name FROM prof WHERE prof_id = ? UNION SELECT 3 AS result, student_name AS name FROM student WHERE student_id = ?', [
    userId, userId, userId
  ], (error, results) => {
    if (!error) {
      const rest = results[0] ? results[0] : -1;
      resolve(rest);
    } else {
      reject(error);
    }
  });
}

function updateFailedTimes(resolve, userId) {
  const connection = getDBConnection();
  connection.query('UPDATE login SET failed_time = failed_time + 1  WHERE id =?', [
    userId
  ], (error, results) => {
    if (!error) {
      connection.query('SELECT failed_time AS result FROM login WHERE id =?', [
        userId, userId
      ], (error, results) => {
        if (!error) {
          const rest = results[0] ? results[0].result : -1;

          resolve(rest);
        }
      });
    }
  });
}

function insertNewUserLoginInformation(resolve, userId, password) {
  const connection = getDBConnection();
  connection.query('INSERT INTO login(id, password, failed_time) values(?,?,?)' +
    ' ON DUPLICATE KEY UPDATE ' +
    ' password = VALUES(password), ' +
    ' failed_time = VALUES(failed_time) ', [
    userId, password, 0
    // eslint-disable-next-line node/handle-callback-err
  ], (error, results) => {
    const rest = results[0] ? results[0].result : -1;
    resolve(rest);
  });
}

function createAdminUser() {
  const adminUser = {
    id: process.env.ADMIN_USERNAME || '1',
    password: process.env.ADMIN_USERNAME || 'admin'
  };
  const connection = getDBConnection();
  connection.query('SELECT 1 AS result FROM login WHERE id = ? AND password = ?', [
    adminUser.id, adminUser.password
    // eslint-disable-next-line node/handle-callback-err
  ], (error, results) => {
    if (!results || !results.length) {
      // only insert if the user could not be found
      console.log('Inserting admin user');
      connection.query('INSERT IGNORE INTO login(id, password, failed_time) values(?,?,?)', [
        adminUser.id, adminUser.password, 0
      ], () => {
        console.log('Admin user inserted, creating admin record');
        connection.query('INSERT IGNORE INTO admin(admin_id) values(?)', [
          adminUser.id
        ], (error, result) => {
          console.log('Admin record inserted', error, result);
        });
      });
    }
  });
}

function setCourse(resolve, reject, course) {
  const connection = getDBConnection();
  connection.query('INSERT INTO comp4004.course (course_id, course_name,course_status,course_assigned_prof_id, course_capacity)' +
    ' VALUES (?,?,?,?,?) ' +
    ' ON DUPLICATE KEY UPDATE ' +
    ' course_name = VALUES(course_name), ' +
    ' course_status = VALUES(course_status), ' +
    ' course_assigned_prof_id = VALUES(course_assigned_prof_id), ' +
    ' course_capacity = VALUES(course_capacity) ', [
    course.courseId, course.courseName, course.courseStatus, course.assignedProf || null, course.courseCapacity
    // eslint-disable-next-line node/handle-callback-err
  ], (error, results) => {
    resolve(results.insertId || course.courseId);
  });
}

function setTimeSlot(resolve, reject, slots, courseId) {
  const connection = getDBConnection();
  connection.query('DELETE FROM course_slots WHERE course_id = ?;', [courseId]);

  if (slots && slots.length > 0) {
    slots.forEach(element => {
      element.id = courseId;
    });
    connection.query('INSERT INTO course_slots(course_slots_day, course_slots_time, course_id) values ?;', [
        slots.map(element => [element.day, element.time, element.id])], function (error, result) {
        if (error) { reject(error); }
        resolve(courseId);
      }
    );
  }
}

function setPreclusions(resolve, reject, preclusions, courseId) {
  const connection = getDBConnection();
  connection.query('DELETE FROM preclusions WHERE course_id = ?;', [courseId]);
  if (preclusions && preclusions.length > 0) {
    connection.query('INSERT INTO preclusions(preclusions_course_id, course_id) values ?;', [
      preclusions.map(element => [element, courseId])], resolve(courseId)
    );
  }
}

function setPrerequisites(resolve, reject, prerequisites, courseId) {
  const connection = getDBConnection();
  connection.query('DELETE FROM prerequisites WHERE course_id = ?;', [courseId]);
  if (prerequisites && prerequisites.length > 0) {
    connection.query('INSERT INTO prerequisites(prerequisites_course_id, course_id) values ?;', [
      prerequisites.map(element => [element, courseId])], resolve(courseId)
    );
  }
}

function getCourse(resolve, reject, courseId, showDeleted = false) {
  const connection = getDBConnection();
  connection.query('SELECT JSON_OBJECT(\'courseId\', c.course_id, \'courseName\', course_name, \'courseStatus\', course_status, \'courseCapacity\', course_capacity, \'assignedProf\', course_assigned_prof_id, ' +
    ' \'courseSlots\', COALESCE(s.slots, JSON_ARRAY()), \'preclusions\', COALESCE(p.preclusions, JSON_ARRAY()), \'prerequisites\', COALESCE(p2.prerequisites, JSON_ARRAY())) AS result' +
    ' FROM course c LEFT JOIN ' +
    ' (SELECT JSON_ARRAYAGG(JSON_OBJECT(\'day\', course_slots_day, \'time\', course_slots_time)) AS slots, course_id FROM course_slots group by course_id) s ON s.course_id = c.course_id ' +
    ' LEFT JOIN (SELECT JSON_ARRAYAGG(preclusions_course_id) preclusions, course_id FROM preclusions group by course_id) p ON p.course_id = c.course_id ' +
    ' LEFT JOIN (SELECT JSON_ARRAYAGG(prerequisites_course_id) prerequisites, course_id FROM prerequisites group by course_id) p2 ON p2.course_id = c.course_id WHERE c.course_id = ?' +
    (showDeleted ? '' : ' AND c.course_status != \'deleted\''), [
    courseId
  ], (error, results) => {
    if (!error) {
      const rest = results[0] ? results[0] : -1;
      resolve(rest);
    }
  });
}

// Remove all records with course_id
// Affected tables: registration, deliverable, course_slots
// Used by: Cancel a class
function removeAllRecordsWithCourseIdInRegistrationDeliverableCourseSlots(resolve, reject, courseId) {
  const connection = getDBConnection();

  connection.query(`
    DELETE FROM registration WHERE course_id = ${courseId};
    DELETE FROM deliverable WHERE course_id = ${courseId};
    DELETE FROM course_slots WHERE course_id = ${courseId};
  `, (error, results) => {
    if (error) {
      reject(error);
    } else {
      resolve(courseId);
    }
  });
}

function getAllCourse(resolve, reject) {
  const connection = getDBConnection();
  connection.query('SELECT JSON_OBJECT(\'courseId\', c.course_id, \'courseName\', course_name, \'courseStatus\', course_status, \'courseCapacity\', course_capacity, \'assignedProf\', course_assigned_prof_id, ' +
    ' \'courseSlots\', COALESCE(s.slots, JSON_ARRAY()), \'preclusions\', COALESCE(p.preclusions, JSON_ARRAY()), \'prerequisites\', COALESCE(p2.prerequisites, JSON_ARRAY())) AS result' +
    ' FROM course c LEFT JOIN ' +
    ' (SELECT JSON_ARRAYAGG(JSON_OBJECT(\'day\', course_slots_day, \'time\', course_slots_time)) AS slots, course_id FROM course_slots group by course_id) s ON s.course_id = c.course_id ' +
    ' LEFT JOIN (SELECT JSON_ARRAYAGG(preclusions_course_id) preclusions, course_id FROM preclusions group by course_id) p ON p.course_id = c.course_id ' +
    ' LEFT JOIN (SELECT JSON_ARRAYAGG(prerequisites_course_id) prerequisites, course_id FROM prerequisites group by course_id) p2 ON p2.course_id = c.course_id' +
    ' WHERE c.course_status != \'deleted\'',
    (error, results) => {
      if (!error) {
        const rest = results || -1;
        resolve(rest);
      }
    });
}

// Change a course's status
// Affected tables: course
// Used by: Cancel a class
function changeCourseStatusInCourseTable(resolve, reject, courseId, status) {
  const connection = getDBConnection();

  connection.query(`
    UPDATE course SET course_status = ? WHERE course_id = ?;
  `, [status, courseId], (error, results) => {
    if (error) {
      reject(error);
    } else {
      resolve(courseId);
    }
  });
}

// Retrieve a student
// Affected tables: student
const getStudentUser = (resolve, reject, studentId) => {
  const connection = getDBConnection();

  connection.query(`
    SELECT * FROM student WHERE student_id = ?;
  `, [studentId], (error, results) => {
    if (error) {
      reject(error);
    } else {
      resolve(results);
    }
  });
};

// Retrieve all students
// Affected tables: student
const getAllStudents = (resolve, reject) => {
  const connection = getDBConnection();

  connection.query(`
    SELECT * FROM student;
  `, (error, results) => {
    if (error) {
      reject(error);
    } else {
      resolve(results);
    }
  });
};

// Retrieve all students registered in a course
// Affected tables: student
const getCourseStudents = (resolve, reject, courseId) => {
  const connection = getDBConnection();

  connection.query(`
    SELECT s.*, r.registration_id, r.final_grade FROM student as s INNER JOIN registration as r ON r.student_id = s.student_id AND r.drop_date IS NULL WHERE r.course_id = ?;
  `, [courseId], (error, results) => {
    if (error) {
      reject(error);
    } else {
      resolve(results);
    }
  });
};

// Add a new student
// Affected tables: student, login
function createStudentUser(resolve, reject, email, birthDate, name, password, admitted) {
  const connection = getDBConnection();

  // default value for birthDate
  const defaultBirthDate = new Date();
  // default value for password
  const defaultPassword = 'password';

  // Create new student record in 'student' table
  // Create new login in 'login' table
  connection.query('INSERT INTO comp4004.login (password) VALUES (?)', [password || defaultPassword], (error, result) => {
    if (error) {
      reject(error);
    } else {
      connection.query('INSERT INTO comp4004.student (student_id, student_name, student_email, admitted, birth_date) VALUES (?,?,?,?,?)', [
        result.insertId,
        name,
        email,
        admitted || false,
        birthDate || defaultBirthDate,
      ], (error, result) => {
        if (error) {
          reject(error);
        } else {
          // success
          resolve(result.insertId);
        }
      });
    }
  });
}

// Modify an existing student user
const modifyStudentUser = (resolve, reject, studentId, email, birthDate, name, admitted, password) => {
  const connection = getDBConnection();

  const queryElement = [];
  const parameters = [];

  // update user info
  if (email) {
    queryElement.push('student_email = ?');
    parameters.push(email);
  }
  if (name) {
    queryElement.push('student_name = ?');
    parameters.push(name);
  }
  if (admitted) {
    queryElement.push('admitted = ?');
    parameters.push(admitted);
  }
  if (birthDate) {
    queryElement.push('birth_date = ?');
    parameters.push(new Date(birthDate));
  }

  if (queryElement.length > 0) {
    connection.query(
      `UPDATE comp4004.student SET ${queryElement.join(',')} WHERE student_id = ?;`,
      parameters.concat(studentId),
      error => {
        if (error) {
          reject(error);
        } else if (password) {
          connection.query('UPDATE login SET password = ? WHERE id = ?', [password, studentId], error => {
            if (error) {
              reject(error);
            } else {
              resolve(studentId);
            }
          });
        } else {
          resolve(studentId);
        }
      });
  }
};

// Deletes a student from DB
// Affected tables: student, login
const deleteStudentUser = (resolve, reject, studentId) => {
  const connection = getDBConnection();
  connection.query(`
    DELETE FROM login WHERE id = ${studentId};
    DELETE FROM student WHERE student_id = ${studentId};
  `, (error, results) => {
    if (error) {
      console.log(error);
      return reject(error);
    } else {
      resolve(studentId);
    }
  });
};

function approveStudentCreation(resolve, reject, studentId) {
  const connection = getDBConnection();
  connection.query('UPDATE student SET admitted = true WHERE student_id = ?;', [studentId], (error, results) => {
    if (error) {
      console.log(error);
      return reject(error);
    } else {
      resolve(studentId);
    }
  });
}

function registerCourse(resolve, reject, studentId, courseId) {
  const connection = getDBConnection();
  connection.query('SELECT admitted FROM student WHERE student_id = ?;', [studentId], (error, results) => {
    if (error) {
      console.log(error);
      return reject(error);
    } else {
      const admitted = results[0] ? results[0].admitted : -1;
      if (admitted <= 0) {
        return reject('You are not admitted to be a student yet');
      }
      connection.query(
        'SELECT course_status, course_capacity, (SELECT COUNT(registration.registration_id) FROM registration ' +
        'WHERE registration.course_id = course.course_id AND registration.drop_date IS NULL) as registeredCount FROM course WHERE course_id = ?;',
        [courseId], (error, results) => {
          if (error) {
            console.log(error);
            return reject(error);
          } else {
            const courseStatus = results[0] ? results[0].course_status : -1;
            const courseCapacity = results[0] ? results[0].course_capacity : -1;
            const registeredCount = results[0] ? results[0].registeredCount : -1;

            if (!String(courseStatus).includes('scheduled')) {
              return reject('This course is not open for registration');
            }

            if (registeredCount >= courseCapacity) {
              return reject('There are no slots remaining for this course');
            }

            connection.query('SELECT registration_deadline FROM academic;', [], (error, results) => {
              if (error) {
                console.log(error);
                return reject(error);
              } else {
                const deadline = results[0] ? results[0].registration_deadline : -1;
                const today = new Date();
                if (Date.parse(deadline) > today) {
                  connection.query('CALL insert_student(?, ?, ?, 0);', [courseId, studentId, today], (error, results) => {
                    if (error) {
                      console.log(error);
                      return reject(error);
                    } else {
                      // Will happen if there are no more slots in the course during the insertion
                      if (results[0][0]['-1']) {
                        return reject('There are no slots remaining for this course');
                      }

                      resolve({
                        registrationId: Object.values(results[0][0])[0],
                        message: 'Your registration for course ' + courseId + ' is done!',
                      });
                    }
                  });
                } else {
                  connection.query('CALL insert_student(?, ?, ?, 1);', [courseId, studentId, today], (error, results) => {
                    if (error) {
                      console.log(error);
                      return reject(error);
                    } else {
                      // Will happen if there are no more slots in the course during the insertion
                      if (results[0][0]['-1']) {
                        return reject('There are no slots remaining for this course');
                      }

                      resolve({
                        registrationId: Object.values(results[0][0])[0],
                        message: 'You missed the deadline. So, your late registration for course ' + courseId + ' is subject to be approved by admin',
                      });
                    }
                  });
                }
              }
            });
          }
        });
    }
  });
}

function dropCourse(resolve, reject, studentId, courseId) {
  const connection = getDBConnection();
  connection.query('SELECT admitted FROM student WHERE student_id = ?;', [studentId], (error, results) => {
    if (error) {
      console.log(error);
      return reject(error);
    } else {
      const admitted = results[0] ? results[0].admitted : -1;
      if (admitted <= 0) {
        return reject('You are not admitted to be a student yet');
      }
      connection.query('SELECT drop_deadline FROM academic;', [], (error, results) => {
        if (error) {
          console.log(error);
          return reject(error);
        } else {
          const deadline = results[0] ? results[0].drop_deadline : -1;
          const today = new Date();
          if (Date.parse(deadline) > today) {
            connection.query('UPDATE registration SET drop_date = ?, late_drop = 0, late_drop_approval = NULL ' +
              ' WHERE course_id = ? AND student_id = ?', [today, courseId, studentId], (error, results) => {
              if (error) {
                console.log(error);
                return reject(error);
              } else {
                resolve('Your drop for course ' + courseId + ' is done!');
              }
            });
          } else {
            connection.query('UPDATE registration SET drop_date = ?, late_drop = 1, late_drop_approval = 0 ' +
              ' WHERE course_id = ? AND student_id = ?', [today, courseId, studentId], (error, results) => {
              if (error) {
                console.log(error);
                return reject(error);
              } else {
                resolve('You missed the deadline. So, your late drop for course ' + courseId + ' is subject to be approved by admin');
              }
            });
          }
        }
      });
    }
  });
}

function getRegisteredCourses(resolve, reject, studentId) {
  const connection = getDBConnection();
  connection.query('SELECT admitted FROM student WHERE student_id = ?;', [studentId], (error, results) => {
    if (error) {
      console.log(error);
      return reject(error);
    } else {
      const admitted = results[0] ? results[0].admitted : -1;
      if (admitted <= 0) {
        return reject('You are not admitted to be a student yet');
      }
      connection.query('SELECT JSON_ARRAYAGG(JSON_OBJECT(\'registrationId\', r.registration_id, \'courseId\', r.course_id, \'courseName\', c.course_name, \'studentId\', r.student_id, \'registrationDate\', ' +
        ' r.registration_date, \'dropDate\', r.drop_date, \'lateRegistration\', r.late_registration, \'lateRegistrationApproval\', r.late_registration_approval, ' +
        ' \'lateDrop\', r.late_drop, \'lateDropApproval\', r.late_drop_approval, \'finalGrade\', r.final_grade, \'courseSlots\', COALESCE(s.slots, JSON_ARRAY()))) AS result FROM registration as r ' +
        ' LEFT JOIN course as c ON r.course_id = c.course_id LEFT JOIN (SELECT JSON_ARRAYAGG(JSON_OBJECT(\'day\', course_slots_day, \'time\', course_slots_time)) ' +
        ' AS slots, course_id FROM course_slots group by course_id) s ON s.course_id = c.course_id ' +
        ' WHERE student_id = ?;', [studentId], (error, results) => {
        if (error) {
          console.log(error);
          return reject(error);
        } else {
          const registration = results[0].result;
          return resolve(registration);
        }
      });
    }
  });
}

function getRegisteredCourse(resolve, reject, courseId, studentId) {
  const connection = getDBConnection();
  connection.query('SELECT admitted FROM student WHERE student_id = ?;', [studentId], (error, results) => {
    if (error) {
      console.log(error);
      return reject(error);
    } else {
      const admitted = results[0] ? results[0].admitted : -1;
      if (admitted <= 0) {
        return reject('You are not admitted to be a student yet');
      }
      connection.query('SELECT JSON_ARRAYAGG(JSON_OBJECT(\'registrationId\', r.registration_id, \'courseId\', r.course_id, \'courseName\', c.course_name, \'studentId\', r.student_id, \'registrationDate\', ' +
        ' r.registration_date, \'dropDate\', r.drop_date, \'lateRegistration\', r.late_registration, \'lateRegistrationApproval\', r.late_registration_approval, ' +
        ' \'lateDrop\', r.late_drop, \'lateDropApproval\', r.late_drop_approval, \'finalGrade\', r.final_grade, \'courseSlots\', COALESCE(s.slots, JSON_ARRAY()))) AS result FROM registration as r ' +
        ' LEFT JOIN course as c ON r.course_id = c.course_id LEFT JOIN (SELECT JSON_ARRAYAGG(JSON_OBJECT(\'day\', course_slots_day, \'time\', course_slots_time)) ' +
        ' AS slots, course_id FROM course_slots group by course_id) s ON s.course_id = c.course_id ' +
        ' WHERE student_id = ? AND r.course_id = ?;', [studentId, courseId], (error, results) => {
        if (error) {
          console.log(error);
          return reject(error);
        } else {
          const registration = results[0].result;
          return resolve(registration);
        }
      });
    }
  });
}

function addTestDataForStudentTest() {
  const connection = getDBConnection();
  console.log('Course and prof insert');
  connection.query('DELETE FROM academic; INSERT IGNORE INTO prof (prof_id, prof_name) VALUES(3234, \'testname\'); ' +
    'INSERT IGNORE INTO comp4004.course (course_id, course_name,course_status,course_assigned_prof_id, course_capacity)' +
    // eslint-disable-next-line node/handle-callback-err
    ' VALUES (123,\'test\',\'scheduled\',3234,30), ' +
    '  (1234,\'test2\',\'cancel\',null,30) ', [], (error, results) => {
    if (error) {
      console.log(error);
    }
    console.log('student insert');
    connection.query('INSERT IGNORE INTO comp4004.login (id, password,failed_time)' +
      // eslint-disable-next-line node/handle-callback-err
      ' VALUES (223,\'test\',0), ' +
      '  (2234,\'test\',0), ' +
      '  (3234,\'test\',0), ' +
      '  (22345,\'test\',0) ', [], (error, results) => {
      if (error) {
        console.log(error);
      }
      console.log('student insert done');
      const date = new Date();
      date.setDate(date.getDate() + 1);
      connection.query('INSERT IGNORE INTO academic (registration_deadline, drop_deadline) VALUES(?,?)', [date.toISOString().substring(0, 10), date.toISOString().substring(0, 10)]);
      connection.query('INSERT IGNORE INTO student (student_id, student_name,student_email,admitted, birth_date)' +
        // eslint-disable-next-line node/handle-callback-err
        ' VALUES (223,\'test\',\'test@test.ca\',1,\'2020-10-10\'), ' +
        '  (2234,\'test2\',\'test2@test.ca\',0,\'2020-10-10\'), ' +
        '  (22345,\'test3\',\'test3@test.ca\',1,\'2020-10-10\') ', [], (error, results) => {
        if (error) {
          console.log(error);
        }

        console.log('Inserting deliverables');
        connection.query('INSERT IGNORE INTO deliverable (deliverable_id, course_id, deliverable_type, deliverable_deadline) VALUES(?, ?, ?,?)', ['1', '123', 'assignment', date.toISOString().substring(0, 10)]);
      });
    });
  });
}

function updateAcademicForTest(resolve, reject) {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  connection.query('UPDATE academic SET  registration_deadline = ?, drop_deadline = ?', [date.toISOString().substring(0, 10), date.toISOString().substring(0, 10)], (error, results) => {
    if (error) {
      return reject(error);
    }
    resolve(results);
  });
}

// Verify if courseId exists in course table
const checkCourseIdInCourseTable = (resolve, reject, courseId) => {
  const connection = getDBConnection();
  connection.query(`
    SELECT EXISTS(SELECT * FROM course WHERE course_id = ${courseId});
  `, (error, result) => {
    if (error) {
      reject(error);
    } else {
      resolve(result);
    }
  });
};

// Create new or replace existing course_slots row
const createCourseIdInCourseSlotsTable = (resolve, reject, courseId, courseSlotDay, courseSlotTime) => {
  const connection = getDBConnection();

  // check if courseId exists in course_slots first
  connection.query(`
    SELECT EXISTS(SELECT * FROM course_slots WHERE course_id = ${courseId});
  `, (error, result) => {
    if (error) {
      reject(error);
    } else {
      // hasCourseId
      const hasCourseId = Object.values(result[0]);

      const queryInsert = `
        INSERT INTO course_slots (course_id, course_slots_day, course_slots_time)
        VALUES (${courseId},${courseSlotDay},'${courseSlotTime}');
      `;

      const queryReplace = `
        UPDATE course_slots SET course_slots_day = ${courseSlotDay}, course_slots_time = '${courseSlotTime}'
        WHERE course_id = ${courseId};
      `;

      // If exists, then replace, otherwise insert new
      if (hasCourseId) {
        connection.query(queryReplace, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(courseId);
          }
        });
      } else {
        connection.query(queryInsert, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(courseId);
          }
        });
      }
    }
  });
};

// Unschedule an existing course, if it is in course_slots table
const deleteCourseIdInCourseSlotsTable = (resolve, reject, courseId) => {
  const connection = getDBConnection();
  connection.query(`
    DELETE FROM course_slots WHERE course_id = ${courseId};
  `, (error, result) => {
    if (error) {
      reject(error);
    } else {
      resolve(courseId);
    }
  });
};
function setProfForCourse(resolve, reject, courseId, ProfId) {
  const connection = getDBConnection();
  connection.query('UPDATE course SET course_assigned_prof_id = ? WHERE course_id = ?', [
    ProfId, courseId
    // eslint-disable-next-line node/handle-callback-err
  ], (error, results) => {
    if (error) {
      reject(error);
    }
    resolve(courseId);
  });
}

function updateAcademicDeadline(resolve, reject, regDeadline, dropDeadline) {
  const connection = getDBConnection();

  connection.query('DELETE FROM academic', [], (error, results) => {
    if (error) {
      console.log(error);
      reject(error);
    }
    connection.query('INSERT INTO academic(registration_deadline, drop_deadline) VALUES (?,?)', [
      regDeadline, dropDeadline
      // eslint-disable-next-line node/handle-callback-err
    ], (error, results) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve();
    });
  });
}

function getAcademicDeadline(resolve, reject) {
  const connection = getDBConnection();
  connection.query('SELECT registration_deadline, drop_deadline FROM academic', [], (error, results) => {
    if (error) {
      reject(error);
    }
    const res = results[0] || -1;
    resolve(res);
  });
}

// Create new deliverable for a given courseId
const createNewDeliverable = (resolve, reject, courseId, deliverableType, deliverableDeadline) => {
  const connection = getDBConnection();

  // Create new deliverable
  connection.query(`
    INSERT INTO deliverable (course_id, deliverable_type, deliverable_deadline)
    VALUES (?, ?, ?);
  `, [courseId, deliverableType, deliverableDeadline], (error, result) => {
    if (error) {
      reject(error);
    } else {
      // success
      resolve(result.insertId);
    }
  });
};

// Modify a deliverable for a given deliverableId
const modifyDeliverable = (resolve, reject, deliverableId, deliverableType, deliverableDeadline) => {
  const connection = getDBConnection();

  // Update a deliverable deliverable
  connection.query(`
    UPDATE deliverable SET deliverable_type = ?, deliverable_deadline = ?
    WHERE deliverable_id = ?;
  `, [deliverableType, deliverableDeadline, deliverableId], (error, result) => {
    if (error) {
      reject(error);
    } else {
      // success
      resolve(deliverableId);
    }
  });
};

// Delete a deliverable for a given deliverableId
const deleteDeliverable = (resolve, reject, deliverableId) => {
  const connection = getDBConnection();

  // Update a deliverable deliverable
  connection.query(`
    DELETE FROM deliverable WHERE deliverable_id = ?;
  `, [deliverableId], (error, result) => {
    if (error) {
      reject(error);
    } else {
      // success
      resolve();
    }
  });
};

// Lists the courses for a prof
function getCoursesForProf(resolve, reject, profId) {
  const connection = getDBConnection();
  connection.query('SELECT JSON_ARRAYAGG(JSON_OBJECT(\'courseId\', c.course_id, \'courseName\', c.course_name)) AS result FROM course as c ' +
    ' WHERE course_assigned_prof_id = ?;', [profId], (error, results) => {
    if (error) {
      console.log(error);
      return reject(error);
    } else {
      return resolve(results[0].result);
    }
  });
}

// Retrieves deliverable from a given deliverableId
const getDeliverable = (resolve, reject, deliverableId) => {
  const connection = getDBConnection();
  connection.query('SELECT * FROM deliverable WHERE deliverable_id = ?', [deliverableId], (error, results) => {
    if (error) {
      reject(error);
    } else {
      resolve(results);
    }
  });
};

// Retrieve all deliverables from a given courseId
const getCourseDeliverable = (resolve, reject, courseId) => {
  const connection = getDBConnection();
  connection.query('SELECT * FROM deliverable WHERE course_id = ?', [courseId], (error, results) => {
    if (error) {
      reject(error);
    } else {
      resolve(results || -1);
    }
  });
};

// Retrieve a prof
// Affected tables: prof
const getProf = (resolve, reject, profId) => {
  const connection = getDBConnection();

  connection.query(`
    SELECT * FROM prof WHERE prof_id = ?;
  `, [profId], (error, results) => {
    if (error) {
      reject(error);
    } else {
      resolve(results);
    }
  });
};

// Retrieve all profs
// Affected tables: prof
const getAllProfs = (resolve, reject) => {
  const connection = getDBConnection();

  connection.query(`
    SELECT * FROM prof;
  `, (error, results) => {
    if (error) {
      reject(error);
    } else {
      resolve(results);
    }
  });
};

// Add a new prof
// Affected tables: prof, login
function createProfUser(resolve, reject, name, password) {
  const connection = getDBConnection();

  // default value for password
  const defaultPassword = 'password';

  // Create new student prof in 'prof' table
  // Create new login in 'login' table
  connection.query('INSERT INTO comp4004.login (password) VALUES (?)', [password || defaultPassword], (error, result) => {
    if (error) {
      reject(error);
    } else {
      connection.query('INSERT INTO comp4004.prof (prof_id, prof_name) VALUES (?,?)', [
        result.insertId,
        name
      ], (error, result) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          // success
          resolve(result.insertId);
        }
      });
    }
  });
}

// Deletes a prof from DB
// Affected tables: student, login
const deleteProfUser = (resolve, reject, profId) => {
  const connection = getDBConnection();
  connection.query(`
    DELETE FROM login WHERE id = ${profId};
    DELETE FROM student WHERE student_id = ${profId};
  `, (error, results) => {
    if (error) {
      console.log(error);
      return reject(error);
    } else {
      resolve(profId);
    }
  });
};

// Modify an existing prof user
const modifyProfUser = (resolve, reject, profId, name, password) => {
  const connection = getDBConnection();

  // update user info
  if (name) {
    connection.query(
      'UPDATE comp4004.prof SET prof_name = ? WHERE prof_id = ?;',
      [name, profId],
      error => {
        if (error) {
          reject(error);
        } else if (password) {
          connection.query('UPDATE login SET password = ? WHERE id = ?', [password, profId], error => {
            if (error) {
              reject(error);
            } else {
              resolve(profId);
            }
          });
        } else {
          resolve(profId);
        }
      });
  } else if (password) {
    connection.query('UPDATE login SET password = ? WHERE id = ?', [password, profId], error => {
      if (error) {
        reject(error);
      } else {
        resolve(profId);
      }
    });
  }
};

// Create new submission for a deliverable for a given courseId
const createSubmission = (resolve, reject, req) => {
  const connection = getDBConnection();
  const deliverableId = req.body.deliverableId;
  const registrationId = req.body.registrationId;
  const fileType = req.files.submission.mimetype;
  const filePath = '/temp/upload/' + req.files.submission.name;
  const file = req.files.submission;

  if (process.env.NODE_ENV === 'test') {
    // Test only code without file management.
    connection.query('INSERT INTO submission(registration_id, deliverable_id, submission_date, submission_file, file_type, file_name) VALUES(?,?,?, ?, ?, ?)',
      [registrationId, deliverableId, new Date(), file.data, fileType, file.name], (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            deliverableId: deliverableId,
            registrationId: registrationId,
            submissionId: result.insertId,
          });
        }
      });
    return;
  }

  fs.mkdirSync('/temp/upload/', { recursive: true });

  file.mv(filePath, function (err) {
    if (err) { return reject(err); }
    connection.query('INSERT INTO submission(registration_id, deliverable_id, submission_date, submission_file, file_type, file_name) VALUES(?,?,?, ?, ?, ?)',
      [registrationId, deliverableId, new Date(), file.data, fileType, file.name], error => {
        if (error) {
          reject(error);
        } else {
          resolve({ deliverableId: deliverableId, registrationId: registrationId });
        }
      });
  });
};

// Get a submission submission for a deliverable for a given deliverableId
const getSubmission = (resolve, reject, registrationId, deliverableId) => {
  const connection = getDBConnection();

  connection.query('SELECT * FROM submission WHERE registration_id = ? AND deliverable_id = ?',
    [registrationId, deliverableId], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
};

// Create new submission for a deliverable for a given deliverableId
const getSubmissions = (resolve, reject, deliverableId) => {
  const connection = getDBConnection();

  connection.query('SELECT * FROM submission WHERE deliverable_id = ?',
    [deliverableId], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
};

// Updates the grade of a submission on a given submissionId
const setGradeOnSubmission = (resolve, reject, submissionId, grade) => {
  const connection = getDBConnection();

  connection.query('UPDATE submission SET submission_grade = ? WHERE submission_id = ?',
    [grade, submissionId], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
};

// Updates the grade of a deliverable for a specific student
const setGradeOnFinal = (resolve, reject, courseId, registrationid) => {
  const connection = getDBConnection();

  connection.query('UPDATE registration SET final_grade = COALESCE((SELECT ' +
    'SUM(submission.submission_grade) / COUNT(submission.submission_grade) FROM submission ' +
    'INNER JOIN deliverable ON deliverable.deliverable_id = submission.deliverable_id ' +
    'WHERE deliverable.course_id = ? AND registration_id = ?), \'N/A\') WHERE registration_id = ?;',
    [courseId, registrationid, registrationid], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
};

module.exports = {
  getDBConnection,
  checkUserRole,
  updateFailedTimes,
  insertNewUserLoginInformation,
  setCourse,
  setTimeSlot,
  setPreclusions,
  setPrerequisites,
  getCourse,
  createAdminUser,

  // cancel course
  removeAllRecordsWithCourseIdInRegistrationDeliverableCourseSlots,
  changeCourseStatusInCourseTable,

  // retrieve a student
  getStudentUser,
  getAllStudents,
  getCourseStudents,

  // create student
  createStudentUser,

  // modify student
  modifyStudentUser,

  // delete student
  deleteStudentUser,
  getAllCourse,
  approveStudentCreation,
  registerCourse,
  getRegisteredCourse,
  getRegisteredCourses,
  dropCourse,
  addTestDataForStudentTest,
  updateAcademicForTest,

  // verify if courseId exists in course table
  checkCourseIdInCourseTable,
  // create or update course_slots table
  createCourseIdInCourseSlotsTable,
  // delete from course_slots table
  deleteCourseIdInCourseSlotsTable,
  setProfForCourse,
  updateAcademicDeadline,
  getAcademicDeadline,

  getCoursesForProf,
  createNewDeliverable,
  modifyDeliverable,
  deleteDeliverable,
  getDeliverable,
  getCourseDeliverable,
  createProfUser,
  deleteProfUser,
  modifyProfUser,
  getProf,
  getAllProfs,
  createSubmission,
  getSubmission,
  getSubmissions,
  setGradeOnSubmission,
  setGradeOnFinal
};
