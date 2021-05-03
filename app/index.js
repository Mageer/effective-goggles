const express = require('express');
const weatherRouter = require('./router');
require('./db');

const app = express();

app.use('/weather', weatherRouter);

// Error handling.
app.use((error, req, res, next) => {
  res.status(500).json({ error: error.toString() });
  next();
});

// Page not found.
app.get('/*', (req, res) => res.status(404).send('Page not found'));

const port = process.env.PORT ? process.env.PORT : 3000;
app.listen(port, () => console.log(`Listening on port: ${port}`));
