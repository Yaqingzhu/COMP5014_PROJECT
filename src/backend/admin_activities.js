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

//helper functions

function validateAdmin(req, res) {
    if (!req.session || !req.session.isLogin) {
        console.warn('User is not logged in');
        return res.status(403).json({
            responseCode: -1,
            // eslint-disable-next-line no-tabs
            errorMessage: 'You need to login before doing this operation.'
        });

    } else if (req.session.role !== 'admin') {
        console.warn('User is not an admin');
        return res.status(403).json({
            responseCode: -1,
            // eslint-disable-next-line no-tabs
            errorMessage: 'You do not have permission to do this operation.'
        });
    }

    return true;
}

//Cancel a course
//
async function CancelCourse(req, res) {

    if(validateAdmin(req, res)) {
        // Find all record with course_id in
        // tables named "registration", "deliverable", "course_slots"
        // Remove these records
        // Set status of course_id in "course" table to "Cancelled"

        const course_id = req.body.course_id || null;

        if(!course_id) {
            return res.status(403).json({
                responseCode: -1,
                errorMessage: 'No course_id specified.'
            })
        }

        new Promise((resolve, reject) => {
            mysql.removeAllRecordsWithCourseIdInRegistrationDeliverableCourseSlots(resolve, reject, course_id)
        }).catch( err => {
            return res.status(403).json({
                responseCode: -1,
                errorMessage: err.message
            })
        });

        new Promise((resolve, reject) => {
            mysql.changeCourseStatusInCourseTable(resolve, reject, course_id, 'Cancelled');
        }).catch(err => {
            return res.status(403).json({
                responseCode: -1,
                errorMessage: err.message
            })
        });

        return res.status(200).json({
            responseCode: 0,
            errorMessage: '',
            success: true
        });
    }   
}

module.exports = { CourseProcess, CancelCourse };
