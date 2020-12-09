const express = require('express');
const session = require('express-session');
const cors = require('cors');
const login = require('./login');
const bodyParser = require('body-parser');

const { createAdminUser, addTestDataForStudentTest } = require('./db_util');
const admin = require('./admin_activities');
const student = require('./student_activities');
const prof = require('./prof_activities');
const general = require('./general_APIs');
const fileUpload = require('express-fileupload');

const app = express();
const port = process.env.API_PORT || 11234; // Port for the API

app.use(session({
  secret: 'somesecrettoken',
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: 20 * 60 * 1000, // 20 mins
    sameSite: false,
  },
}));

app.use(bodyParser.urlencoded({ extended: true }));

// use bodyParser-json
app.use(bodyParser.json());

// use bodyParser-text
app.use(bodyParser.text({ type: 'txt' }));
app.use(cors({
  origin: 'http://localhost:8081',
  credentials: true,
  exposedHeaders: ['set-cookie'],
}));

app.use(fileUpload());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/login', login.loginRequestProcess);
app.post('/logout', login.setLogout);

createAdminUser();
addTestDataForStudentTest();

app.post('/courseop', admin.CourseProcess);

app.post('/cancelcourse', admin.CancelCourse);

app.get('/student', general.getStudent);
app.get('/students', general.getStudents);
app.get('/coursestudents', general.getCourseStudents);
app.post('/createstudent', admin.CreateStudent);
app.post('/modifystudent', admin.ModifyStudent);
app.post('/approvestudent', admin.ApproveStudentCreationApply);
app.post('/applycreatestudent', student.applyCreateStudent);
app.post('/registercourse', student.registerCourse);
app.post('/dropcourse', student.dropCourse);
app.get('/listcourses', student.listCourse);
app.get('/registeredcourse', student.getCourse);
app.delete('/deletestudent', admin.DeleteStudent);
app.post('/assignprof', admin.assignProf);

app.post('/updateacademicline', admin.updateAcademicDeadline);
app.get('/academicline', admin.getAcademicDeadline);

app.post('/schedulecourse', admin.ScheduleCourse);
app.post('/unschedulecourse', admin.UnscheduleCourse);

app.post('/createdeliverable', prof.createCourseDeliverable);
app.post('/modifydeliverable', prof.modifyCourseDeliverable);
app.post('/deletedeliverable', prof.deleteCourseDeliverable);
app.get('/deliverable', general.getDeliverable);
app.get('/coursedeliverable', general.getCourseDeliverables);

app.get('/course', general.getCourse);
app.get('/profcourses', prof.listCourses);

app.get('/profs', general.getProfs);
app.post('/createprof', admin.CreateProf);
app.post('/modifyprof', admin.ModifyProf);
app.delete('/deleteprof', admin.DeleteProf);

app.post('/submitdeliverable', student.submitDeliverable);
app.get('/submissions', general.getSubmissions);
app.get('/submission', general.getSubmission);
app.post('/gradesubmission', prof.gradeSubmission);
app.post('/submitfinalgrade', prof.finalGradeSubmission);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}

module.exports = app;
