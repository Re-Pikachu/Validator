const express = require('express');
const path = require('path');
const PORT = 3000;

const app = express();

// app.use(express.static(path.resolve(__dirname, "./dist")))  FOR PROUDCTION
app.use('/', express.static(path.resolve(__dirname, "./"))) // this was also changed
// app.get('/', (req, res) => {
//   res.status(200).sendFile('index.html');
// });



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });