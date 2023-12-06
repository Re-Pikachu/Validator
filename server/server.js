const path = require('path');
const express = require('express');
const sql = require('mssql');
const app = express();
const cors = require('cors');
const config = require('../config.js');
const { title } = require('process');
const PORT = 3010;

/**
 * handle parsing request body
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database
async function connectToDatabase(req, res, next) {
  try {
    await sql.connect(config);
    console.log('Connected to the database');
    return next();
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}

// Perform a simple query
async function fetchPosts(req, res, next) {
  try {
    const result = await sql.query(`SELECT * FROM [dbo].[posts]`);
    //console.log('Data fetched:', result.recordset);
    res.locals.posts = result.recordset;
    return next();
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  }
}

// Close the database connection
async function closeConnection(req, res, next) {
  try {
    await sql.close();
    res.status(200).json(res.locals.posts);
    console.log('Connection closed');
  } catch (err) {
    console.error('Error closing connection:', err);
  }
}

async function insertPost(req, res, next) {
  const result = await sql.query(
    `INSERT INTO [dbo].[posts](user_id, title, userPrompt, chatGBT_response) 
    VALUES (${1}, ${'Greetings'}, ${'How many likes to the center of the lollipop'}, ${'More licks than there are grains of sand in the world'})`
  );
  // `INSERT INTO [dbo].[posts](user_id, title, userPrompt, chatGBT_response) VALUES (${1}, ${'Greetings'}, ${'How many likes to the center of the lollipop'}, ${'More licks than there are grains of sand in the world'})`
  // );
  console.log(result);

  // `INSERT INTO [dbo].[posts] (user_id, title, userPrompt, chatGBT_response, created_at) VALUES (${3}, 'Greetings', 'How many licks to the center of the lollipop', 'too many', GETDATE())`
  // ${req.body.user_id},
  // ${req.body.title},
  // ${req.body.userprompt},
  // ${req.body.chatgpt_response},
  // )`)

  // const result1 = await sql.query(`INSERT INTO POSTS ()`)

  return next();
}

/**
 * define route handlers
 */

//signIn authentication for credentials
// app.post('/api/signin', Controller.Authentication, (req, res) => {
//   console.log('if youre seeing this you reached the internal api signin');
//   res.status(200).json(res.locals.activitySave);
// });
// Express route to fetch data for all posts
app.get('/api/data/allPosts', connectToDatabase, fetchPosts, closeConnection);

//route for front end ot talk to

//input: two strings. 1st: user input 2nd: ChatGPT response
app.get(
  '/api/newEntry',
  connectToDatabase,
  insertPost,
  closeConnection,
  (req, res) => res.status(200).send('posted')
);

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
