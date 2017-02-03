const TOKEN = 'put bot token here';
const Discord = require('discord.js');
const bot = new Discord.Client();
// login the bot
bot.login(TOKEN);
// critical, makes sure the bot will only start after discord gives it the green flag
bot.on('ready', () => {
  console.log('I am ready!');
});
// Load the user class
var User = require("./User.js");