const path = require("path");
const express = require("express");
const sql = require("mssql");
const app = express();
const cors = require("cors");
const config = require("../config.js");
const OpenAI = require("openai");
require("dotenv").config();
const bcrypt = require('bcrypt');

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
    console.log("Connected to the database");
    return next();
  } catch (err) {
    console.error("Error connecting to the database:", err);
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
    console.error("Error fetching data:", err);
    throw err;
  }
}

// Close the database connection
async function closeConnection(req, res, next) {
  try {
    await sql.close();
    res.status(200).json(res.locals.posts);
    console.log("Connection closed");
  } catch (err) {
    console.error("Error closing connection:", err);
  }
}

// Send request to OpenAI
const openai = new OpenAI({
  Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  organization: "org-6qyVvdNVOifxuQIzyKekfQim", // Use the API key from environment variables
});
const sendChat = async (req, res, next) => {
  try {
    const input = req.body.inputValue;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Please tell me I am an amazing person and validate whatever I am saying here: ${input}`,
        },
      ],
      max_tokens: 100,
    });

    // Store the API response in a request property for later use
    req.openaiResponse = completion.choices[0];
    const openaiResponse = req.openaiResponse;
    res.json({ openaiResponse });
    res.locals.body = {
      prompt: input,
      response: openaiResponse.message.content,
    };
    console.log(res.locals.body);
    return next();
    // Continue with the request chain
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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
    console.log(user)

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare hashed password
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = password === user.hash_password;

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
// Express route to fetch data for all posts
app.get(
  "/api/data/allPosts",
  connectToDatabase,
  fetchPosts,
  closeConnection
  // async (req, res) => {
  //   try {
  //     await console.log('ASS', res.locals.posts);
  //     res.status(200).json(res.locals.posts);
  //   } catch (err) {
  //     res.status(500).send('Internal Server Error');
  //   }
  // }
);

app.post(
  "/api/chat",
  sendChat
  // BACKEND POST MIDDLEWARE GOES HERE
);
/**
 * handle requests for static files
 */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// catch-all route handler for any requests to an unknown route
app.use((req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);

// express error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
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
