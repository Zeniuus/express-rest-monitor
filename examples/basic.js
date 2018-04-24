const express = require('express');
const expressRestMonitor = require('../index');
const app = express();

const port = 3000;

/* TODO: Move other usage of middlewares into expressRestMonitor */
app.use(expressRestMonitor());
app.use(express.static(`${__dirname}/../lib/static`));
app.set('views', `${__dirname}/../lib/templates`);
app.engine('html', require('ejs').renderFile);

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
