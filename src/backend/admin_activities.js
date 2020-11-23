const mysql = require('./db_util');

async function CourseProcess(req, res) {
    if (!req.session || !req.session.isLogin) {
        console.warn('User is not logged in');
        res.status(403).json({
            responseCode: -1,
            // eslint-disable-next-line no-tabs
            errorMessage: 'You need to login before doing this operation.'
        });
    } else if (req.session.role !== 'admin') {
        console.warn('User is not an admin');
        res.status(403).json({
            responseCode: -1,
            // eslint-disable-next-line no-tabs
            errorMessage: 'You do not have permission to do this operation.'
        });
    } else {
        doProcess(req.body, req, res);
    }
}

function doProcess(body, req, res) {
    new Promise((resolve, reject) => {
        mysql.setCourse(resolve, reject, body);
    }).catch(err => {
        res.status(400).json({
            responseCode: -1,
            errorMessage: err.message,
        });
    }).then(doTimeSlotProcess(body, req, res)
    );
}

function doTimeSlotProcess(body, req, res) {
    new Promise(function (resolve, reject) {
        mysql.setTimeSlot(resolve, reject, body.course_slots, body.courseId);
    }).catch(err => {
        res.status(400).json({
            responseCode: -1,
            errorMessage: err.message,
        });
    }).then(doPreclusionsProcess(body, req, res));
}

function doPreclusionsProcess(body, req, res) {
    new Promise((resolve, reject) => {
        mysql.setPreclusions(resolve, reject, body.preclusions, body.courseId);
    }).catch(err => {
        res.status(400).json({
            responseCode: -1,
            errorMessage: err.message,
        });
    }).then(doPrerequisitesProcess(body, req, res));
}

function doPrerequisitesProcess(body, req, res) {
    new Promise((resolve, reject) => {
        mysql.setPrerequisites(resolve, reject, body.prerequisites, body.courseId);
    }).catch(err => {
        res.status(400).json({
            responseCode: -1,
            errorMessage: err.message,
        });
    }).then(endRequestWithFinished(res, body));
}

function endRequestWithFinished(res, body) {
    new Promise((resolve, reject) => {
        mysql.getCourse(resolve, reject, body.courseId);
    }).catch(err => {
        res.status(400).json({
            responseCode: -1,
            errorMessage: err.message,
        });
    }).then(function (result) {
        res.status(200).json({
            responseCode: 0,
            errorMessage: '',
            coursePayload: result.result
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

// Determines whether a given email string is valid
function validateEmail(email) {
    return (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email));
}

// Cancel a course
const CancelCourse = async (req, res) => {
    // Validation
    if (!validateLogin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You need to login before doing this operation.',
        });
    } else if (!validateAdmin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You do not have permission to do this operation.',
        });
    }

    const courseId = req.body.courseId || null;

    if (!courseId) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'No courseId specified.'
        });
    }

    await new Promise((resolve, reject) => {
        mysql.removeAllRecordsWithCourseIdInRegistrationDeliverableCourseSlots(resolve, reject, courseId);
    }).catch(err => {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: err.message
        });
    });

    await new Promise((resolve, reject) => {
        mysql.changeCourseStatusInCourseTable(resolve, reject, courseId, 'Cancelled');
    }).catch(err => {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: err.message
        });
    });

    return res.status(200).json({
        responseCode: 0,
        errorMessage: '',
        success: true
    });
};

// Create Student
const CreateStudent = async (req, res) => {
    // Validation
    if (!validateLogin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You need to login before doing this operation.',
        });
    } else if (!validateAdmin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You do not have permission to do this operation.',
        });
    }

    // Get form information
    const email = req.body.email;
    const birthDate = req.body.birthDate;
    const name = req.body.name;
    const password = req.body.password;
    const admitted = req.body.admitted;

    // Validate email
    if (!validateEmail(email)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'Invalid email format'
        });
    }

    // Perform operation in DB
    await new Promise((resolve, reject) => {
        mysql.createStudentUser(resolve, reject, email, birthDate, name, password, admitted);
    }).then(id => {
        return res.status(200).json({
            responseCode: 0,
            errorMessage: '',
            success: true,
            studentId: id
        });
    }).catch(error => {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: error
        });
    });
};

// Delete Student, given a student_id
const DeleteStudent = async (req, res) => {
    // Validation
    if (!validateLogin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You need to login before doing this operation.',
        });
    } else if (!validateAdmin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You do not have permission to do this operation.',
        });
    }

    // Get form information
    const studentId = req.body.studentId;

    // Perform operation in DB
    await new Promise((resolve, reject) => {
        mysql.deleteStudentUser(resolve, reject, studentId);
    }).then(id => {
        return res.status(200).json({
            responseCode: 0,
            errorMessage: '',
            success: true,
            studentId: id
        });
    }).catch(error => {
        console.log(error);
        return res.status(403).json({
            responseCode: -1,
            errorMessage: error
        });
    });
};

module.exports = {
    CourseProcess,
    CancelCourse,
    CreateStudent,
    DeleteStudent
};
