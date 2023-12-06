const path = require('path');
const express = require('express');
const sql = require('mssql');
const app = express();
const cors = require('cors');
const config = require('../config.js');
const bcrypt = require('bcrypt');
const PORT = 3010;


/**
 * handle parsing request body
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database
async function connectToDatabase() {
  try {
    await sql.connect(config);
    console.log('Connected to the database');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}

// Perform a simple query
async function fetchData() {
  try {
    const result = await sql.query`SELECT * FROM [dbo].[users]`;
    console.log('Data fetched:', result.recordset);
    return result.recordset;
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  }
}

// Close the database connection
async function closeConnection() {
  try {
    await sql.close();
    console.log('Connection closed');
  } catch (err) {
    console.error('Error closing connection:', err);
  }
}

async function authenticateUser(email, password) {
  try {
    const result = await sql.query`SELECT * FROM [dbo].[users] WHERE email = ${email}`;
    
    if (!result.recordset || result.recordset.length === 0) {
      return null; // User not found
    }

    const user = result.recordset[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null; // Invalid password
    }

    return user; // Authentication successful
  } catch (err) {
    console.error('Error authenticating user:', err);
    throw err;
  }
}

/**
 * define route handlers
 */

//signIn authentication for credentials
// app.post('/api/signin', Controller.Authentication, (req, res) => {
//   console.log('if youre seeing this you reached the internal api signin');
//   res.status(200).json(res.locals.activitySave);
// });

// Express route to fetch data
app.get('/api/data', async (req, res) => {
  try {
    await connectToDatabase();
    const data = await fetchData();
    res.json(data);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  } finally {
    await closeConnection();
  }
});

/**
 * handle requests for static files
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// catch-all route handler for any requests to an unknown route
app.use((req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);

// express error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

/**
 * start server
 */
app.listen(PORT, () => {
  console.log(`Server listening on port: http//localhost:${PORT}...`);
});

module.exports = app;
