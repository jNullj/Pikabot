// for testing/easy configuration
const botinfo = require("./botinfo.js");

const TOKEN = botinfo.token;
const Discord = require('discord.js');
const bot = new Discord.Client();
// login the bot
bot.login(TOKEN);
// critical, makes sure the bot will only start after discord gives it the green flag
bot.on('ready', () => {
  console.log('I am ready!');
});
// Load the user class
const User = require('./User.js');
// Load commands class
const Command = require('./Command.js');

// create an event listener for messages
bot.on('message', message => {
  switch (message.content) {
    case '!points':
      points = Command.getPoints(message.author.id);
      message.reply('You have '+points+' points.');
      break;
    case (message.content.match(/^!setBDay /) || {}).input: // cheaks if starts with !setBDay
        // isolate the date from the command
        var regex = /!setBDay (.)/;
        result = Command.setBDay(message.author.id, message.content.match(regex));
        if (result) {
            // Should it do anything?
        }else{
            message.reply('Invalid, please write the day in the following format YYYY-MM-DD, without spaces');
        }
        break;
    case '!help':
      message.channel.sendMessage('Commands: !points, !setBDay');
      break;
  
    default:
      break;
  }
});

