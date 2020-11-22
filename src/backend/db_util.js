const mysql = require('mysql');

// Environment variables for the database
const { DB_PORT, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;

let connection = null;

function getDBConnection() {
  if (!connection) {
    connection = mysql.createConnection({
      port: DB_PORT || 3306,
      host: DB_HOST || '35.222.224.200',
      user: DB_USERNAME || 'root',
      password: DB_PASSWORD || 'comp4004',
      database: DB_DATABASE || 'comp4004'
    });
  }
  return connection;
}

function checkUserRole(resolve, reject, userId) {
  const connection = getDBConnection();
  connection.query('UPDATE login SET failed_time = 0 WHERE id =?', [
    userId
  ]);
  connection.query('SELECT 1 AS result, admin_name AS name FROM admin WHERE admin_id = ? UNION SELECT 2 AS result, prof_name AS name FROM prof WHERE prof_id = ? UNION SELECT 2 AS result, student_name AS name FROM student WHERE student_id = ?', [
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
    console.log(error, results);
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
    course.courseId, course.courseName, course.courseStatus, course.assignedProf, course.courseCapacity
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
  getAllCourse
};
