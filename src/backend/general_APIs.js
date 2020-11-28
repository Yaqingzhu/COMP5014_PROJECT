const mysql = require('./db_util');

async function getCourse(req, res) {
    if (!req.session || !req.session.isLogin) {
        res.status(403).json({
            responseCode: -1,
            // eslint-disable-next-line no-tabs
            errorMessage: 'You need to login before doing this operation.'
        });
    } else {
        getCourseFromDB(res, req.query);
    }
}

function getCourseFromDB(res, body) {
    new Promise((resolve, reject) => {
        if (body.courseId) {
            mysql.getCourse(resolve, reject, body.courseId);
        } else {
            console.log('getall');
            mysql.getAllCourse(resolve, reject);
        }
    }).catch(err => {
        res.status(400).json({
            responseCode: -1,
            errorMessage: err.message,
        });
    }).then(function (result) {
        res.status(200).json({
            responseCode: 0,
            errorMessage: '',
            coursePayload: body.courseId ? result.result : result
        });
    });
}

// helper functions

function validateLogin(req) {
    if (!req.session || !req.session.isLogin) {
        console.warn('User is not logged in');
        return false;
    }

    return true;
}

function validateAdmin(req) {
    if (req.session.role !== 'admin') {
        console.warn('User is not an admin');
        return false;
    }

    return true;
}

function validateStudent(req) {
    if (req.session.role !== 'student') {
        console.warn('User is not an student');
        return false;
    }

    return true;
}

function validateProf(req) {
    if (req.session.role !== 'prof') {
        console.warn('User is not an prof');
        return false;
    }

    return true;
}

// Determines whether a given email string is valid
function validateEmail(email) {
    return (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email));
}

// Determine whether a string conforms to time format of HH:MM (24 hour)
function validateTime(time) {
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]/.test(time);
}

// Get a student
// Sample response
// {
//     "responseCode": 0,
//     "errorMessage": "",
//     "student": [
//         {
//             "student_id": 2,
//             "student_name": "Flanders",
//             "student_email": "nedflanders@gmail.com",
//             "admitted": 1,
//             "birth_date": "2020-11-22T00:00:00.000Z"
//         }
//     ]
// }
// student is an empty array if no hits found
const getStudent = async (req, res) => {
    // Validate login
    if (!validateLogin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You need to login before performing this operation.',
        });
    }

    const studentId = req.query.studentId;

    try {
        const student = await new Promise((resolve, reject) => {
            mysql.getStudentUser(resolve, reject, studentId);
        });

        if (!student.length) {
            return res.status(404).json({
                responseCode: -1,
                errorMessage: 'No student user found for the specified id',
            });
        }
        return res.status(200).json({
            responseCode: 0,
            errorMessage: '',
            student: {
                studentId: student[0].student_id,
                studentName: student[0].student_name,
                studentEmail: student[0].student_email,
                admitted: student[0].admitted,
                birthDate: student[0].birth_date,
            }
        });
    } catch (error) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'Error retrieving student from database',
        });
    }
};

// student is an empty array if no hits found
const getStudents = async (req, res) => {
    // Validate login
    if (!validateLogin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You need to login before performing this operation.',
        });
    }

    try {
        const students = await new Promise((resolve, reject) => {
            mysql.getAllStudents(resolve, reject);
        });
        return res.status(200).json({
            responseCode: 0,
            errorMessage: '',
            students: students.map(function (student) {
                return {
                    studentId: student.student_id,
                    studentName: student.student_name,
                    studentEmail: student.student_email,
                    admitted: student.admitted,
                    birthDate: student.birth_date,
                };
            }),
        });
    } catch (error) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'Error retrieving student from database',
        });
    }
};

module.exports = {
    getCourse,
    validateLogin,
    validateAdmin,
    validateStudent,
    validateProf,
    validateEmail,
    validateTime,
    // get a student
    getStudent,
    getStudents,
};
