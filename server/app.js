var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser')
var handler = require('./src/handler.js')
var app = express()

app.use(cors());

var jsonParser = bodyParser.json()

global.__basedir = __dirname;


app.get('/', function (req, res) {
   res.send('SUCCESS')
})

app.get('/statusCheck', function (req, res) {
   res.send('SUCCESS')
})

app.post('/command', jsonParser, function (req, res) {
   let body = req.body.body;
   let cmd = body.command;
   let path = body.path;
   let args = body.args;
   if (cmd === undefined || path === undefined) {
      return res.status(500).send("Missing request body")
   }
   var ret = handler.commandHandler(cmd, path, args)
   res.send(ret)
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Server listening at http://%s:%s", host, port)
})