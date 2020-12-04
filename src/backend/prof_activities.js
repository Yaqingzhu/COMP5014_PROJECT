const mysql = require('./db_util');
const util = require('./general_APIs');

// List the courses associated with a prof
const listCourses = async (req, res) => {
    // Validation
    if (!util.validateLogin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You need to login before doing this operation.',
        });
    } else if (!util.validateProf(req) && !util.validateAdmin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You do not have permission to do this operation.',
        });
    }

    try {
        const courses = await new Promise((resolve, reject) => {
            mysql.getCoursesForProf(resolve, reject, req.query.profId);
        });

        return res.status(200).json({
            responseCode: 0,
            success: true,
            courses,
        });
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'Error in listing the courses. Are your inputs correct?'
        });
    }
};

// Create a course deliverable
// Given the courseId, deliverableType (string), deliverableDeadline (datetime)
const createCourseDeliverable = async (req, res) => {
    // Validation
    if (!util.validateLogin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You need to login before doing this operation.',
        });
    } else if (!util.validateProf(req) && !util.validateAdmin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You do not have permission to do this operation.',
        });
    }

    // Get form information
    const courseId = req.body.courseId;
    let deliverableType = req.body.deliverableType;
    let deliverableDeadline = new Date(req.body.deliverableDeadline);

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
        verifyInCourse = Object.values(verifyInCourse[0])[0];

        if (verifyInCourse !== 1) {
            console.log(verifyInCourse);
            return res.status(404).json({
                responseCode: -1,
                errorMessage: 'Could not find courseId. Create the course first.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            responseCode: -1,
            errorMessage: 'Error in searching for courseId in database.'
        });
    }

    // Create new record in "deliverable" table
    try {
        // Parse input
        deliverableDeadline = deliverableDeadline || null;
        deliverableType = deliverableType || '';

        const deliverableId = await new Promise((resolve, reject) => {
            mysql.createNewDeliverable(resolve, reject, courseId, deliverableType, deliverableDeadline);
        });

        return res.status(200).json({
            responseCode: 0,
            success: true,
            deliverableId
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            responseCode: -1,
            errorMessage: 'Error in creating new deliverable. Are your inputs correct?'
        });
    }
};

// Modify a course deliverable
// Given the deliverableId, deliverableType (string), deliverableDeadline (datetime)
const modifyCourseDeliverable = async (req, res) => {
    // Validation
    if (!util.validateLogin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You need to login before doing this operation.',
        });
    } else if (!util.validateProf(req) && !util.validateAdmin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You do not have permission to do this operation.',
        });
    }

    // Get form information
    const deliverableId = req.body.deliverableId;
    const deliverableType = req.body.deliverableType;
    const deliverableDeadline = new Date(req.body.deliverableDeadline);

    try {
        await new Promise((resolve, reject) => {
            mysql.modifyDeliverable(resolve, reject, deliverableId, deliverableType, deliverableDeadline);
        });

        return res.status(200).json({
            responseCode: 0,
            success: true,
            deliverableId
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            responseCode: -1,
            errorMessage: 'Error in modifying a deliverable. Are your inputs correct?'
        });
    }
};

// Delete a course deliverable
// Given the deliverableId
const deleteCourseDeliverable = async (req, res) => {
    // Validation
    if (!util.validateLogin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You need to login before doing this operation.',
        });
    } else if (!util.validateProf(req) && !util.validateAdmin(req)) {
        return res.status(403).json({
            responseCode: -1,
            errorMessage: 'You do not have permission to do this operation.',
        });
    }

    // Get form information
    const deliverableId = req.body.deliverableId;

    try {
        await new Promise((resolve, reject) => {
            mysql.deleteDeliverable(resolve, reject, deliverableId);
        });

        return res.status(200).json({
            responseCode: 0,
            success: true,
            deliverableId
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            responseCode: -1,
            errorMessage: 'Error in creating deleting a deliverable. Are your inputs correct?'
        });
    }
};

module.exports = {
    listCourses,
    // Create a course deliverable
    createCourseDeliverable,
    modifyCourseDeliverable,
    deleteCourseDeliverable,
};
