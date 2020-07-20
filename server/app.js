var express = require('express');
var cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
let commandsJson = require('./database/commands.json');
let contentJson = require('./database/content.json');
let typesJson = require('./database/types.json');
const path = require('path');
var fs = require('fs');
var app = express();

app.use(cors());
app.use('/img', express["static"](path.join(__dirname, 'public/images')));
app.use('/pdf', express["static"](path.join(__dirname, 'public/pdf')));

var jsonParser = bodyParser.json();

var port = process.env.PORT | 8081;

// For sending emails
var transporter = nodemailer.createTransport({
   service: 'hotmail',
   auth: {
      user: 'shaural@live.com',
      pass: process.env.EMAIL_PASS
   }
});


global.__basedir = __dirname;


app.get('/', function (req, res) {
   res.send('SUCCESS');
});

app.get('/statusCheck', function (req, res) {
   res.send('SUCCESS');
});


app.get('/commands/:name?', function (req, res) {
   let cmdName = req.params.name;
   if (!cmdName) {
      return res.send(commandsJson);
   }
   let cmdObj = commandsJson.find(cmdObj => {
      return cmdObj.command === cmdName
   });
   if (!cmdObj) {
      return res.sendStatus(404);
   }
   res.send(cmdObj);
})

app.get('/ls/:path/:simple?', function (req, res) {
   let isSimple = true;
   if (req.params.simple === undefined || req.params.simple === "") {
      isSimple = false;
   }
   let path = decodeURIComponent(req.params.path);
   let directory = getDirFromPath(path);
   let fileNames = directory.map(f => {
      var fileType = typesJson.find(t => t.type === f.type);
      if (isSimple) {
         return f.name;
      }
      return `<div style="color:${fileType.color};">${f.name}</div>`;
   });
   res.send(fileNames);
})

app.get('/cd/:path/:name', function (req, res) {
   let path = decodeURIComponent(req.params.path);
   let folderName = req.params.name;
   let directory = getDirFromPath(path);
   if (folderName === "current" || folderName === "parent") {
      return res.send(folderName); // TODO: handle this correctly
   }
   let folder = directory.find(f => f.name === folderName && f.type === "folder");
   if (folder === undefined) {
      res.statusMessage = `Folder ${folderName} does not exist in current directory ${path}`;
      return res.sendStatus(404);
   }
   res.json({ "name": folder.name, "data": folder.data.map(f => f.name) });
})

app.get('/cat/:path/:file', function (req, res) {
   let path = decodeURIComponent(req.params.path);
   let file = req.params.file;
   let directory = getDirFromPath(path);
   let fileObj = directory.find(f => f.name === file);
   if (!fileObj) {
      res.statusMessage = `File ${file} not found at path ${path}`;
      return res.sendStatus(404);
   }
   if (fileObj.type === "link" || fileObj.type === "phone" || fileObj.type === "email") {
      return res.send(fileObj.data);
   } else if (fileObj.type === "text") {
      return res.send(readFile(fileObj.data));
   }
   res.statusMessage = `Wrong file type, could not read contents of file ${file}.`;
   res.sendStatus(500);
});

app.get('/open/:path/:file', function (req, res) {
   let path = decodeURIComponent(req.params.path);
   let file = req.params.file;
   let directory = getDirFromPath(path);
   let fileObj = directory.find(f => f.name === file);
   if (!fileObj) {
      res.statusMessage = `File ${file} not found at path ${path}`;
      return res.sendStatus(404);
   }
   if (fileObj.type === "link" || fileObj.type === "image" || fileObj.type === "pdf") { // TODO: get types from command obj
      return res.json({ "type": fileObj.type, "data": fileObj.data });
   }
   res.statusMessage = `Wrong type, could not open file ${file}.`;
   res.sendStatus(500);
});

var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Server listening at http://%s:%s", host, port)
})
app.post('/mail', jsonParser, function (req, res) {
   var body = req.body;
   if (!body.name || !body.email || !body.subject || !body.message) {
      res.statusMessage = `Could not send email, missing required fields {Name: ${body.name}, Email: ${body.email}, Subject: ${body.subject}, Message: ${body.message}`;
      return res.sendStatus(500);
   }
   var msg = `Sender Name:\t${body.name}\n\nSender Email:\t${body.email}\n\nMessage: ${body.message}`;
   var mailOptions = {
      from: 'shaural@live.com',
      to: 'shaural@live.com',
      subject: body.subject,
      text: msg
   };

   transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
         console.log(error);
         return res.sendStatus(500);
      } else {
         console.log('Email sent: ' + info.response);
         return res.sendStatus(200);
      }
   });
});
function getDirFromPath(path) {
   if (!path) {
      res.statusMessage = `Invalid path ${path}`;
      return res.sendStatus(500);
   }
   let pathSplit = path.split('/');
   if (pathSplit.length < 2 || pathSplit[0] !== "." || pathSplit[1] !== "shaural") {
      res.statusMessage = `Invalid path ${path}`;
      return res.sendStatus(500);
   }
   pathSplit.splice(0, 2); // remove [".", "shaural"]
   let directory = contentJson;
   pathSplit.forEach(dirName => {
      var dirObj = directory.find(obj => {
         return obj.name === dirName && obj.type === "folder";
      });
      if (dirObj === undefined) {
         res.statusMessage = `Invalid path ${path}`;
         return res.sendStatus(500);
      }
      directory = dirObj.data;
   });
   return directory;
}

function readFile(path) {
   const fullPath = __basedir + path
   let ret = "";
   try {
      ret = fs.readFileSync(fullPath);
   } catch (error) {
      ret = `Error: Could not read file ${fullPath}. ErrorMessage: ${error}`;
   }
   return ret;
}
