const mysql = require('./db_util');
const util = require('./general_APIs');

function applyCreateStudent(req, res) {
   // Get form information
   const email = req.body.email;
   const birthDate = req.body.birthDate;
   const name = req.body.name;
   const password = req.body.password;
   const admitted = false;

   // Validate email
   if (!util.validateEmail(email)) {
       console.log('email wrong');
       return res.status(403).json({
           responseCode: -1,
           errorMessage: 'Invalid email format'
       });
   }

   // Perform operation in DB
   new Promise((resolve, reject) => {
       mysql.createStudentUser(resolve, reject, email, birthDate, name, password, admitted);
   }).then(id => {
       return res.status(200).json({
           responseCode: 0,
           errorMessage: '',
           success: true,
           admitted: false
       });
   }).catch(error => {
       return res.status(403).json({
           responseCode: -1,
           errorMessage: error
       });
   });
}

function registerCourse(req, res) {
    // Validation
    if (!util.validateLogin(req)) {
       return res.status(403).json({
           responseCode: -1,
           errorMessage: 'You need to login before doing this operation.',
       });
   } else if (!util.validateStudent(req)) {
    return res.status(403).json({
        responseCode: -1,
        errorMessage: 'You do not have permission to do this operation.',
    });
}
   // Perform operation in DB
   new Promise((resolve, reject) => {
       mysql.registerCourse(resolve, reject, req.body);
   }).then(result => {
       return res.status(200).json({
           responseCode: 0,
           errorMessage: result,
           success: true,
           CourseId: req.body.id
       });
   }).catch(error => {
       return res.status(403).json({
           responseCode: -1,
           errorMessage: error
       });
   });
}

module.exports = {
    applyCreateStudent
};
