const mysql = require('./db_util');

async function getCourse(req, res) {
    if (!req.session || !req.session.isLogin) {
        res.status(403).json({
            responseCode: -1,
            // eslint-disable-next-line no-tabs
            errorMessage: 'You need to login before doing this operation.'
        });
    } else {
        getCourseFromDB(res, req.body);
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

module.exports = {
    getCourse,
    validateLogin,
    validateAdmin,
    validateStudent,
    validateProf,
    validateEmail
};
