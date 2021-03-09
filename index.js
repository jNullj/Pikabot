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
// Load database
const DB = require("./DB.js");

var bday_cheak = 1;    // last date birthday was cheaked

// create an event listener for messages
bot.on('message', message => {
  Command.addPoints(message.author.id, 1);
  switch (message.content) {
    case '!points':
      points = Command.getPoints(message.author.id);
      message.reply('You have '+points+' points.');
      break;
    case (message.content.match(/^!setBDay /) || {}).input: // cheaks if starts with !setBDay
        // isolate the date from the command
        var regex = /!setBDay (.*)/;
        result = Command.setBDay(message.author.id, message.content.match(regex)[1]);
        if (result) {
            message.reply('Birthday was set for <@' + message.author.id + '>');
        }else{
            message.reply('Invalid, please write the day in the following format YYYY-MM-DD, without spaces');
        }
        break;
    case '!help':
      message.channel.sendMessage('Commands: !points, !setBDay');
      break;
  
    default:
        eventHandler(message);
        break;
  }
});

// handles events which are cheaked on each message
function eventHandler(message){
    bdayHandler(message);
}

// cheaks for new/old birthdays and updates server
function bdayHandler(message){
    // if birthday was already cheaked today, dont cheak agian
    var d = new Date();
    var today = d.toISOString().substring(0,10);
    if (bday_cheak==today) {
        return false;
    }
    // get the birthday role
    var myRole = message.guild.roles.cache.find(role => role.name === 'BIRTHDAY');
    // remove old birthday kings 👑 from role
    if (myRole.members.cache) { // if there are old members, remove them
      myRole.members.cache.find(user => user.removeRole(myRole));
    }
    // read all birthdays
    
    var kings = Command.findBDayKing();
    kings.forEach(king_id => {
        // if user birthday is today do the thing
        var bdking = message.guild.members.cache.find(GuildMember => GuildMember.id == king_id)
        var myRole = message.guild.roles.cache.find(role => role.name === 'BIRTHDAY');
        bdking.roles.add(myRole);
        // add user to BIRTHDAY role
        // let everyone know the member has a birthday
        var main_channel = bot.channels.cache.find(channel => channel.name == 'general');
        main_channel.send(`👑Happy Birthday ${bdking}!👑`);
    });
    
    // update last cheak date to today
    bday_cheak = today;
}

// Create an event listener for new guild members
bot.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the server, ${member}`);
});
