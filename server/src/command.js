let commandsJson = require('../database/commands.json');
let contentJson = require('../database/content.json');
var fs = require('fs');

const echo = (args) => {
    if (args === undefined || args === "") {
        return "";
    }
    return args.join(" ");
}

function readFile(path) {
    const fullPath = __basedir + path
    let ret = "";
    try {
        ret = fs.readFileSync(fullPath);
    } catch (error) {
        ret = `Could not read file ${fullPath}`;
    }
    return ret;
}

const printFiles = (path, args) => {
    if (path === undefined || path === "" || args === undefined || args === "") {
        return "File not found";
    }
    let pathSplit = path.split('/');
    if (pathSplit.length < 2 || pathSplit[0] !== "." || pathSplit[1] !== "shaural") {
        return "Invalid path";
    }
    pathSplit.shift(); // remove .
    pathSplit.shift(); // remove shaural
    let directory = contentJson;
    pathSplit.forEach(dirName => {
        var dirObj = directory.find(obj => {
            return obj.name === dirName && obj.type === "folder";
          });
        if (dirObj === undefined) {
            return "Invalid path";
        }
        directory = dirObj;
    });
    let result = "";
    args.forEach(arg => {
        var file = directory.find(obj => {
            return obj.name == arg;
        });
        const commandObj = commandsJson.find(e => e.command === "cat");
        if (commandObj.fileTypes.includes(file.type)) {
            result += readFile(file.data);
        } else {
            result += `Invalid file type ${file.type} for file ${file.name}.`;
        }
    });
    return result;
}

module.exports = {
    echo,
    printFiles
};