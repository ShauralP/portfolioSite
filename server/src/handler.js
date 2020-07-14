let commandsJson = require('../database/commands.json')
let command = require('./command.js')

const commandHandler = (cmd, path, args) => {
    var commandObj = commandsJson.find(cmdObj => {
        return cmdObj.command === cmd
      })
    if (commandObj === undefined) {
        return `Command ${cmd} not found.`
    } else {
        let func = command[commandObj.function]
        if (func === undefined) {
            return `Function ${commandObj.function} not found for command ${commandObj.command}`;
        }
        if (commandObj.pathRequired) {
            return func(path, args);
        }
        return func(args);
    }
}

module.exports = {
    commandHandler
};
