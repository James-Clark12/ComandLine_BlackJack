var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
  // res.send('Hello World');
  res.sendfile('./dist/index.html');
});

app.listen(4000, function(){
  console.log("Listening on port 3000!")
});
