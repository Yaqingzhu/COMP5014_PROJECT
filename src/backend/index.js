const express = require('express');
const cors = require('cors');

// Environment variables for the database
// const { DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;

const app = express();
const port = process.env.API_PORT; // Port for the API

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081']
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}

module.exports = app;
