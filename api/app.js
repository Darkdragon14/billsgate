const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create a catch-all route for testing the installation.
app.use('/user', require('./src/user'));

const port = 8000;

app.listen(port, () => {
  console.log('App is now running at port ', port)
})