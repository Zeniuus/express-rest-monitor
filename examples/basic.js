const express = require('express');
const expressRestMonitor = require('../index');
const app = express();

const port = 3000;

app.use(expressRestMonitor);

app.get('/', (req, res) => {
  res.json({
    a: 1,
    b: 2,
    c: 3,
  });
});

app.listen(3000, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
