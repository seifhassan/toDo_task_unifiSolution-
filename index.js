const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const mongoUrl = "mongodb+srv://seiffhassann:SD9xbXBtCzMl7PTQ@todo.tssk0ug.mongodb.net/"
mongoose.connect(mongoUrl)
.then(()=>console.log('connected'))
.catch((error)=>console.log(error));

const app = express();

app.use(express.json());
app.use(routes);

app.use('*', (req, res, next) => {
  const error = new Error(
    `${req.ip} tried to access ${req.originalUrl}`,
  );
  error.statusCode = 404;

  return next(error);
});

app.use((error, req, res, next) => {
  if (error.message === 'Authentication failed ') error.statusCode = 401;
  if (!error.statusCode) error.statusCode = 500;
  return res
    .status(error.statusCode)
    .json({ error: error.toString() });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { console.log(`UP : localhost:${PORT}`); });
