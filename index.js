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

//for testing
// create an event listener for messages
bot.on('message', message => {
  // if the message is "ping",
  if (message.content === '!points') {
    // send "pong" to the same channel.
    myuser = new User(message.author.id);
    myuser.load();
    message.channel.sendMessage(message.author.username + ' has ' + myuser.getPoints() + ' points.');
  }
});