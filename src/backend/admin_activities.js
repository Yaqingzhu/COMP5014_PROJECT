const mysql = require('./db_util');
const util = require('./general_APIs');

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
    }).then(id => doTimeSlotProcess({
        ...body,
        courseId: id,
      }, req, res));
}

function doTimeSlotProcess(body, req, res) {
    new Promise(function (resolve, reject) {
        mysql.setTimeSlot(resolve, reject, body.courseSlots, body.courseId);
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
        mysql.getCourse(resolve, reject, body.courseId, true);
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

// Cancel a course
const CancelCourse = async (req, res) => {
    // Validation
    if (!util.validateLogin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You need to login before doing this operation.',
        });
    } else if (!util.validateAdmin(req)) {
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
    if (!util.validateLogin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You need to login before doing this operation.',
        });
    } else if (!util.validateAdmin(req)) {
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
    if (!util.validateEmail(email)) {
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
    if (!util.validateLogin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You need to login before doing this operation.',
        });
    } else if (!util.validateAdmin(req)) {
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

// Approve a student's creation apply, given a student_id
const ApproveStudentCreationApply = async (req, res) => {
    // Validation
    if (!util.validateLogin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You need to login before doing this operation.',
        });
    } else if (!util.validateAdmin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You do not have permission to do this operation.',
        });
    }

    // Get form information
    const studentId = req.body.studentId;

    // Perform operation in DB
    await new Promise((resolve, reject) => {
        mysql.approveStudentCreation(resolve, reject, studentId);
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

// Schedule a course
// Given courseId
const ScheduleCourse = async (req, res) => {
    // Validation
    if (!util.validateLogin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You need to login before doing this operation.',
        });
    } else if (!util.validateAdmin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You do not have permission to do this operation.',
        });
    }

    // Retrieve courseId
    const courseId = req.body.courseId;
    const courseSlotDay = req.body.courseSlotDay;
    const courseSlotTime = req.body.courseSlotTime;

    // Verify courseSlotDay is between (1-7)
    if (courseSlotDay < 1 || courseSlotDay > 7) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'courseSlotDay must be between 1 and 7, exclusive.',
        });
    }

    // Verify courseTimeSlot is of the format HH:MM, 24 hour format
    if (!util.validateTime(courseSlotTime)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'courseSlotTime must be in HH:MM format.',
        });
    }

    // Verify courseId exists in course table
    let verifyInCourse = false;

    try {
        verifyInCourse = await new Promise((resolve, reject) => {
            mysql.checkCourseIdInCourseTable(resolve, reject, courseId);
        });

        // Return format:
        // [
        //     {
        //         "EXISTS(SELECT * FROM course WHERE course_id = 1234)": (0 or 1)
        //     }
        // ]
        // Get the value by using Object.values(verifyInCourse[0])
        verifyInCourse = Object.values(verifyInCourse[0]);
    } catch (error) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'Could not find courseId. Create the course first.'
        });
    }

    // Verify courseId exists in course_slots table and update row in course_slots
    try {
        await new Promise((resolve, reject) => {
            mysql.createCourseIdInCourseSlotsTable(resolve, reject, courseId, courseSlotDay, courseSlotTime);
        });

        return res.status(200).json({
            responseCode: 0,
            errorMessage: '',
            success: true,
            courseId
        });
    } catch (error) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'Could not create slot.'
        });
    }
};

// Unschedule a course
// Given a courseId
const UnscheduleCourse = async (req, res) => {
    // Validation
    if (!util.validateLogin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You need to login before doing this operation.',
        });
    } else if (!util.validateAdmin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You do not have permission to do this operation.',
        });
    }

    // Retrieve courseId
    const courseId = req.body.courseId;

    // Delete from course_slots table
    try {
        await new Promise((resolve, reject) => {
            mysql.deleteCourseIdInCourseSlotsTable(resolve, reject, courseId);
        });
        return res.status(200).json({
            responseCode: 0,
            errorMessage: '',
            success: true,
            courseId
        });
    } catch (error) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'Could not delete course slot.'
        });
    }
};

module.exports = {
    CourseProcess,
    CancelCourse,
    CreateStudent,
    DeleteStudent,
    ApproveStudentCreationApply,
    ScheduleCourse,
    UnscheduleCourse
};
