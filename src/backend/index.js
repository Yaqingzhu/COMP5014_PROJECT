const express = require('express');
const session = require('express-session');
const cors = require('cors');
const login = require('./login');
const mysql = require('mysql');
const bodyParser = require("body-parser")

const app = express();
const port = process.env.API_PORT || 11234; // Port for the API

app.use(session({
  secret: 'somesecrettoken',
  saveUninitialized: true,
  resave: false,
  cookie: { maxAge: 20*60*1000 }  // 20 mins
}));

app.use(bodyParser.urlencoded({extended:true}))

// use bodyParser-json
app.use(bodyParser.json())

// use bodyParser-text
app.use(bodyParser.text({type:"txt"}))
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081']
}));

app.get('/', (req, res) => {
  res.send('Heasdsadllo World!');
});

app.post('/login', login.loginRequestProcess);



if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}

module.exports = app;
