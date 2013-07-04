var express = require('express');

var app = express.createServer(express.logger());

var helloBuffer = new Buffer(30);

app.get('/', function(request, response) {
  helloBuffer = fs.readFileSync('./index.html');
  response.send(helloBuffer.toString('ascii'));
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
