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

var bday_cheak = 1;    // last date birthday was cheaked

// create an event listener for messages
bot.on('message', message => {
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
            // Should it do anything?
        }else{
            message.reply('Invalid, please write the day in the following format YYYY-MM-DD, without spaces');
        }
        break;
    case '!listchannels':
        var s_channels = message.guild.channels.reduce(function(str,channel) {  return str+'\n'+channel.name },'');
        message.channel.send(s_channels);
        break;
    case '!help':
      message.channel.sendMessage('Commands: !points, !setBDay, !listchannels');
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
    var myRole = message.guild.roles.find('name', 'BIRTHDAY');
    // remove old birthday kings 👑 from role
    myRole.members.reduce(function(hold,user) { user.removeRole(myRole); },0);
    // read all birthdays
    const bdFolder = './db/birthday/';
    const fs = require('fs');
    
    fs.readdir(bdFolder, (err, files) => {
        files.forEach(file => {
            // if user birthday is today do the thing
            var userbday = fs.readFileSync(bdFolder + file, 'utf8');
            if (userbday.substring(6,10) == today.substring(6,10)) {
                // find the user id
                var memid = file.substring(0,file.length-4);
                var bdking = message.guild.member(memid);
                // add user to BIRTHDAY role
                bdking.addRole(myRole);
                // let everyone know the member has a birthday
                message.guild.channels.first().send('Happy Birthday '+bdking+'!');
            }
        });
    })
    
    // update last cheak date to today
    bday_cheak = today;
}
