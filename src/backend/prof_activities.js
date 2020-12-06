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
            console.error('Could not find courseId. Create the course first.', verifyInCourse);
            return res.status(404).json({
                responseCode: -1,
                errorMessage: 'Could not find courseId. Create the course first.'
            });
        }
    } catch (error) {
        console.log(error);
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

function markDeliverable(req, res) {
    // Validation
    if (!util.validateLogin(req)) {
       return res.status(403).json({
           responseCode: -1,
           errorMessage: 'You need to login before doing this operation.',
       });
   } else if (!util.validateprof(req)) {
      return res.status(403).json({
          responseCode: -1,
          errorMessage: 'You do not have permission to do this operation.',
      });
  }
   // Perform operation in DB
   new Promise((resolve, reject) => {
       mysql.submitDeliverable(resolve, reject, req.body);
   }).then(result => {
       return res.status(200).json({
           responseCode: 0,
           errorMessage: '',
           success: true,
           courses: result
       });
   }).catch(error => {
       return res.status(500).json({
           responseCode: -1,
           errorMessage: error
       });
   });
}

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

// Changes teh grade on a given submission
const gradeSubmission = async (req, res) => {
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
        const submissionId = req.body.submissionId;
        const grade = req.body.grade;

        await new Promise((resolve, reject) => {
            mysql.setGradeOnSubmission(resolve, reject, submissionId, grade);
        });

        return res.status(200).json({
            responseCode: 0,
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            responseCode: -1,
            errorMessage: 'Error in updating the grade of a submission. Are your inputs correct?'
        });
    }
};

// Triggers a calculation of the final grade for a course
const finalGradeSubmission = async (req, res) => {
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
        const courseId = req.body.courseId;

        const students = await new Promise((resolve, reject) => {
            mysql.getCourseStudents(resolve, reject, courseId);
        });

        await Promise.all(students.map(async student => {
            return new Promise((resolve, reject) => {
                mysql.setGradeOnFinal(resolve, reject, courseId, student.registration_id);
            });
        }));

        return res.status(200).json({
            responseCode: 0,
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            responseCode: -1,
            errorMessage: 'Error in updating the grade of a submission. Are your inputs correct?'
        });
    }
};

module.exports = {
    listCourses,
    // Create a course deliverable
    createCourseDeliverable,
    markDeliverable,
    modifyCourseDeliverable,
    deleteCourseDeliverable,
    gradeSubmission,
    finalGradeSubmission
};
