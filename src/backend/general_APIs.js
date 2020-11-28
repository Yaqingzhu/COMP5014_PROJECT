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
        return res.status(200).json({
            responseCode: 0,
            errorMessage: '',
            student
        });
    } catch (error) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'Error retrieving student from database',
        });
    }
};

// Retrieve deliverable information
// Given deliverableId
// Sample Response: 
// {
//     "responseCode": 0,
//     "errorMessage": "",
//     "deliverable": {
//         "deliverable_id": 1,
//         "course_id": 123,
//         "deliverable_type": "",
//         "deliverable_deadline": "1970-01-01T00:00:00.000Z"
//     }
// }
// Returns -1 if not found
const getDeliverable = async (req, res) => {
    // Validate login
    if (!validateLogin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You need to login before performing this operation.',
        });
    }

    const deliverableId = req.query.deliverableId;

    try {
        const deliverable = await new Promise((resolve, reject) => {
            mysql.getDeliverable(resolve, reject, deliverableId);
        });
        return res.status(200).json({
            responseCode: 0,
            errorMessage: '',
            deliverable
        })
    } catch (error) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'Error retrieving deliverable from database',
        });
    }
}

// Return ALL deliverables
// given a courseId
// Sample request:
// GET localhost:8080/coursedeliverable?courseId=123
// Sample response:
// {
//     "responseCode": 0,
//     "errorMessage": "",
//     "deliverable": [
//         {
//             "deliverable_id": 1,
//             "course_id": 123,
//             "deliverable_type": "",
//             "deliverable_deadline": "1970-01-01T00:00:00.000Z"
//         },
//         {
//             "deliverable_id": 2,
//             "course_id": 123,
//             "deliverable_type": "Assignment",
//             "deliverable_deadline": "1970-01-01T00:00:00.000Z"
//         }
//     ]
// }
// deliverable is [] if no hits found
const getCourseDeliverables = async (req, res) => {
    // Validate login
    if (!validateLogin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You need to login before performing this operation.',
        });
    }

    const courseId = req.query.courseId;

    try {
        const deliverable = await new Promise((resolve, reject) => {
            mysql.getCourseDeliverable(resolve, reject, courseId);
        });
        return res.status(200).json({
            responseCode: 0,
            errorMessage: '',
            deliverable
        })
    } catch (error) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'Error retrieving deliverable from database',
        });
    }
}

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
    // get a deliverable
    getDeliverable,
    // get all deliverables for a given course
    getCourseDeliverables
};
