var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser')
let commandsJson = require('./database/commands.json')
let contentJson = require('./database/content.json')
let typesJson = require('./database/types.json')
var fs = require('fs');
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

app.get('/ls/:path', function (req, res) {
   let path = decodeURIComponent(req.params.path);
   let directory = getDirFromPath(path);
   let fileNames = directory.map(f => {
      var fileType = typesJson.find(t => t.type === f.type);
      return `<div style="color:${fileType.color};">${f.name}</div>`;
   });
   res.send(fileNames);
})

app.get('/folders/:path/:name?', function (req, res) {
   let path = decodeURIComponent(req.params.path);
   let folderName = req.params.name;
   if (folderName === "..") {
      return res.send("");
   }
   let directory = getDirFromPath(path);
   let fileNames = directory.filter(f => f.type === "folder").map(f => f.name);
   if (folderName) {
      fileNames = fileNames.find(f => f === folderName);
      if (fileNames === undefined || fileNames === "") {
         res.statusMessage = `Folder ${folderName} does not exist in current directory ${path}`;
         return res.sendStatus(404);
      }
   }
   res.send(fileNames);
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
   res.statusMessage =`Wrong file type, could not read contents of file ${file}.` 
   res.sendStatus(500);
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Server listening at http://%s:%s", host, port)
})

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
