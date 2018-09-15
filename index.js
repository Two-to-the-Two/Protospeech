var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/dialogflow', function (req, res) {
  console.log('THRUSTERS FIRED');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
