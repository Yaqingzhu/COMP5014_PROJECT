const express = require('express');
const session = require('express-session');
const cors = require('cors');
const login = require('./login');
const bodyParser = require('body-parser');

const { createAdminUser } = require('./db_util');
const admin = require('./admin_activities');
const general = require('./general_APIs');

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

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/login', login.loginRequestProcess);

createAdminUser();

app.post('/courseop', admin.CourseProcess);

app.post('/cancelcourse', admin.CancelCourse);

app.post('/createstudent', admin.CreateStudent);
app.delete('/deletestudent', admin.DeleteStudent);

app.get('/course', general.getCourse);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}

module.exports = app;
