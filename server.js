const express = require("express");
const path = require("path");
const PORT = 3000;

const app = express();

// app.use(express.static(path.resolve(__dirname, "./dist")))  FOR PROUDCTION
app.use("/", express.static(path.resolve(__dirname, "./"))); // this was also changed
// app.get('/', (req, res) => {
//   res.status(200).sendFile('index.html');
// });

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

//signIn authentication for credentials
app.post("/api/signin", Controller.Authentication, (req, res) => {
  console.log("if youre seeing this you reached the internal api signin");
  res.status(200).json(res.locals.activitySave);
});

//404 for unknown api's
app.use("*", (req, res) => {
  res.status(404).send("Page not found");
});

//global error handler
app.use((err, req, res, next) => {
  const defaultError = {
    log: "An error occurred.",
    status: 500,
    message: { err: "An error has been made" },
  };

  const newError = {
    ...defaultError,
    ...err,
  };

  console.log(newError);

  res.status(newError.status).json(newError.message.err);
});
