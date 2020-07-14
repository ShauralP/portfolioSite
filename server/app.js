var express = require('express');
var bodyParser = require('body-parser')
var handler = require('./src/handler.js')
var app = express()

var jsonParser = bodyParser.json()

global.__basedir = __dirname;


app.get('/', function (req, res) {
   res.send('SUCCESS')
})

app.get('/statusCheck', function (req, res) {
   res.send('SUCCESS')
})

app.get('/command', jsonParser, function (req, res) {
    let cmd = req.body.command
    let path = req.body.path
    let args = req.body.args
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