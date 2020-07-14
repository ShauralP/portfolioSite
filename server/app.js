var express = require('express');
var app = express();

app.get('/', function (req, res) {
   res.send('SUCCESS');
})

app.get('/statusCheck', function (req, res) {
   res.send('SUCCESS');
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Server listening at http://%s:%s", host, port)
})