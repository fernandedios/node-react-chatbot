const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

require('./routes/dialogFlowRoutes');

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`Server started at port ${PORT}`);
});
