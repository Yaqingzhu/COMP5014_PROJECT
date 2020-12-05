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

// student is an empty array if no hits found
const getCourseStudents = async (req, res) => {
    // Validate login
    if (!validateLogin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You need to login before performing this operation.',
        });
    }

    try {
        const students = await new Promise((resolve, reject) => {
            mysql.getCourseStudents(resolve, reject, req.query.courseId);
        });
        return res.status(200).json({
            responseCode: 0,
            errorMessage: '',
            students: students.map(function (student) {
                return {
                    studentId: student.student_id,
                    registrationId: student.registration_id,
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

const getProfs = async (req, res) => {
    // Validate login
    if (!validateLogin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You need to login before performing this operation.',
        });
    }

    const profId = req.query.profId;
    try {
        if (profId) {
            const prof = await new Promise((resolve, reject) => {
                mysql.getProf(resolve, reject, profId);
            });
            return res.status(200).json({
                responseCode: 0,
                errorMessage: '',
                prof: {
                    profId: prof[0].prof_id,
                    profName: prof[0].prof_name,
                },
            });
        }
        const profs = await new Promise((resolve, reject) => {
            mysql.getAllProfs(resolve, reject);
        });
        return res.status(200).json({
            responseCode: 0,
            errorMessage: '',
            profs: profs.map(function (prof) {
                return {
                    profId: prof.prof_id,
                    profName: prof.prof_name,
                };
            }),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            responseCode: -1,
            errorMessage: 'Error retrieving prof from database',
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
            deliverable: {
                deliverableId: deliverable[0].deliverable_id,
                courseId: deliverable[0].course_id,
                deliverableType: deliverable[0].deliverable_type,
                deliverableDeadline: deliverable[0].deliverable_deadline,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            responseCode: -1,
            errorMessage: 'Error retrieving deliverable from database',
        });
    }
};

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
        const result = await new Promise((resolve, reject) => {
            mysql.getCourseDeliverable(resolve, reject, courseId);
        });
        return res.status(200).json({
            responseCode: 0,
            errorMessage: '',
            deliverables: result.map(function (deliverable) {
                return {
                    deliverableId: deliverable.deliverable_id,
                    courseId: deliverable.course_id,
                    deliverableType: deliverable.deliverable_type,
                    deliverableDeadline: deliverable.deliverable_deadline,
                };
            }),
        });
    } catch (error) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'Error retrieving deliverable from database',
        });
    }
};

// Retrieve all deliverable submissions information for a single deliverable
// Given deliverableId
// Sample Response:
// {
//     "responseCode": 0,
//     "errorMessage": "",
//     "submission": {
//         "deliverable_id": 1,
//         "course_id": 123,
//         "submission_date": "1970-01-01T00:00:00.000Z",
//         "submission_file": ""
//     }
// }
// Returns -1 if not found
const getSubmissions = async (req, res) => {
    // Validate login
    if (!validateLogin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You need to login before performing this operation.',
        });
    }

    const deliverableId = req.query.deliverableId;

    try {
        const submissions = await new Promise((resolve, reject) => {
            mysql.getSubmissions(resolve, reject, deliverableId);
        });
        return res.status(200).json({
            responseCode: 0,
            errorMessage: '',
            submissions: submissions.map(submission => ({
                submissionId: submission.submission_id,
                registrationId: submission.registration_id,
                deliverableId: submission.deliverable_id,
                submissionDate: submission.submission_date,
                submissionFile: submission.submission_file,
                fileType: submission.file_type,
                fileName: submission.file_name,
                submissionGrade: submission.submission_grade,
            })),
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            responseCode: -1,
            errorMessage: 'Error retrieving submission from database',
        });
    }
};

// Retrieve deliverable submission information
// Given deliverableId
// Sample Response:
// {
//     "responseCode": 0,
//     "errorMessage": "",
//     "submission": {
//         "deliverable_id": 1,
//         "course_id": 123,
//         "submission_date": "1970-01-01T00:00:00.000Z",
//         "submission_file": ""
//     }
// }
// Returns -1 if not found
const getSubmission = async (req, res) => {
    // Validate login
    if (!validateLogin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You need to login before performing this operation.',
        });
    }

    const registrationId = req.query.registrationId;
    const deliverableId = req.query.deliverableId;

    try {
        const submission = await new Promise((resolve, reject) => {
            mysql.getSubmission(resolve, reject, registrationId, deliverableId);
        });
        return res.status(200).json({
            responseCode: 0,
            errorMessage: '',
            submission: submission.length ? {
                submissionId: submission[0].submission_id,
                registrationId: submission.registration_id,
                deliverableId: submission[0].deliverable_id,
                submissionDate: submission[0].submission_date,
                submissionFile: submission[0].submission_file,
                fileType: submission[0].file_type,
                fileName: submission[0].file_name,
                submissionGrade: submission[0].submission_grade,
            } : null,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            responseCode: -1,
            errorMessage: 'Error retrieving submission from database',
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
    // get a deliverable
    getDeliverable,
    // get all deliverables for a given course
    getCourseDeliverables,
    getSubmissions,
    getSubmission,
    getStudents,
    getCourseStudents,
    getProfs,
};
