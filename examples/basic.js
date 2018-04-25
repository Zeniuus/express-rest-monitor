const express = require('express');
const expressRestMonitor = require('../index');
const bodyParser = require('body-parser');
const app = express();

const port = 3000;

/* TODO: Move other usage of middlewares into expressRestMonitor */
app.use(expressRestMonitor());
app.use(express.static(`${__dirname}/../lib/static`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', `${__dirname}/../lib/templates`);
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
  res.json({
    a: 1,
    b: 2,
    c: 3,
  });
});

app.post('/', (req, res) => {
  res.json({
    body: req.body,
  });
});

app.put('/', (req, res) => {
  res.json({
    method: 'PUT',
  });
});

app.delete('/', (req, res) => {
  res.json({
    method: 'DELETE',
  });
});

app.listen(3000, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
