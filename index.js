const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send({
    'hello': 'world'
  })
});

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`Server started at port ${PORT}`);
});
