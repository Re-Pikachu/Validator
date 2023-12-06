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
// Middleware to hash password before storing in the database -- FOR SIGN UP ONCE ITS BUILT
// async function hashPassword(req, res, next) {
//   const { password } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10); // Use appropriate salt rounds
//     req.hashedPassword = hashedPassword;
//     next();
//   } catch (err) {
//     res.status(500).json({ error: 'Error hashing password' });
//   }
// }

/**
 * define route handlers
 */

// Route handler for user sign-in
app.post('/api/signIn', async (req, res) => {
  console.log('reached signIn api')
  console.log(req.body)

  const { email, password } = req.body;
 
  try {
    await connectToDatabase();

    // Fetch user from the database based on email
    const result = await sql.query`SELECT * FROM [dbo].[users] WHERE email = ${email}`;
    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare hashed password
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = password === user.password;

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('Error during sign-in:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await closeConnection();
  }
});

//WE DONT HAVE THE FRONT END FOR THIS YET - STRETCH GOAL
// app.post('/api/signUp', hashPassword, async (req, res) => {
//   const { email } = req.body;
//   const hashedPassword = req.hashedPassword;

//   try {
//     await connectToDatabase();
//     // Check if the user with the provided email already exists
//     const existingUser = await sql.query`SELECT * FROM [dbo].[users] WHERE email = ${email}`;
//     if (existingUser.recordset.length > 0) {
//       return res.status(400).json({ error: 'User with this email already exists' });
//     }

//     // Insert the new user into the database
//     await sql.query`INSERT INTO [dbo].[users] (email, password) VALUES (${email}, ${hashedPassword})`;
//     res.status(201).json({ success: true, message: 'User created successfully' });
//   } catch (err) {
//     console.error('Error during sign-up:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   } finally {
//     await closeConnection();
//   }
// });


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
