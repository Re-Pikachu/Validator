//This script is a configuration setup for Node.js applciations
//dotenv loads environment variables
const dotenv = require('dotenv');
//by default it looks for a file named .env, config if you want to load differently
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });

//Pull data from .dev file
const server = process.env.AZURE_SQL_SERVER;
const database = process.env.AZURE_SQL_DATABASE;
const port = parseInt(process.env.AZURE_SQL_PORT);
const user = process.env.AZURE_SQL_USER;
const password = process.env.AZURE_SQL_PASSWORD;

const config = {
  server,
  port,
  database,
  user,
  password,
  options: {
    encrypt: true,
  },
};

module.exports = config;
