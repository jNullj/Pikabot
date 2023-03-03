// for testing/easy configuration
const botinfo = require("./botinfo.js");
// for loading command files
const fs = require('node:fs');
const path = require('node:path');

const TOKEN = botinfo.token;
const Discord = require('discord.js');
const myIntents = new Discord.IntentsBitField();
myIntents.add(Discord.IntentsBitField.Flags.GuildMessages);
myIntents.add(Discord.IntentsBitField.Flags.GuildVoiceStates);
myIntents.add(Discord.IntentsBitField.Flags.GuildMembers);
myIntents.add(Discord.IntentsBitField.Flags.Guilds);
myIntents.add(Discord.IntentsBitField.Flags.MessageContent);
const bot = new Discord.Client({ intents: myIntents });

// slash commands handler
bot.commands = new Discord.Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		bot.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

bot.on(Discord.Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// bot events handler
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		bot.once(event.name, (...args) => event.execute(...args));
	} else {
		bot.on(event.name, (...args) => event.execute(...args));
	}
}

// login the bot
bot.login(TOKEN);
// Load the user class
const User = require('./User.js');
// Load commands class
const Command = require('./Command.js');
// Load database
const DB = require("./DB.js");
const { ButtonStyle } = require("discord.js");
DB.init_db(); // generate new db if non exists

var bday_cheak = 1;    // last date birthday was cheaked

// call for the birthday handler each message
bot.on('messageCreate', message => {
  bdayHandler(message);
});

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
    myRole.members.map(user => user.roles.remove(myRole).catch(console.error));

    // read all birthdays

    var kings = Command.findBDayKing();

    // not all members are fetched to cache by default
    // birthday kings might not be cached if they did not interact since last startup
    // as a fix fetch all current guild members prior to finding the members in cache
    message.guild.members.fetch().then(() => {
    kings.forEach(king_id => {
        // if user birthday is today do the thing
        var bdking = message.guild.members.cache.find(GuildMember => GuildMember.id == king_id)
        var myRole = message.guild.roles.cache.find(role => role.name === 'BIRTHDAY');
        bdking.roles.add(myRole);
        // add user to BIRTHDAY role
        // let everyone know the member has a birthday
        var main_channel = bot.channels.cache.find(channel => channel.name == 'general');
        main_channel.send(`👑Happy Birthday ${bdking}!👑`);
    })
    })

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

bot.on('voiceStateUpdate', (oldState, newState) => {

  let oldChannel = oldState.channelId;
  let newChannel = newState.channelId;

  if(oldChannel === null && newChannel != null){
    // user joined voice chat, wellcome them
    let user = newState.member.user;  // find user who joined
    if (user.bot === false) {  // dont triger from bots
        Command.doPikaNoise(newState.channel);
    }
  } else if (oldChannel != null && newState === null) {
    let user = oldState.member.user;  // find user who left
    // user left voice chat :< goodbye
  } else if (oldChannel != null && newChannel != null){
    let user = newState.member.user;  // find user who moved
    // user moved to a new voice channel or changed state
  } else {
    // user is a hacker
  }
})

// handle set-birthday form sumbit
bot.on(Discord.Events.InteractionCreate, async interaction => {
	if (!interaction.isModalSubmit()) return;
	if (interaction.customId !== 'set-birthday-model') return;
  const birthday_in = interaction.fields.getTextInputValue('birthday-text-input');
  const id = interaction.user.id;
  var result;
  var user = new User(id);
  if(!user.isExists()){
    if (user.getID() < 0) {
      throw 'invalid user id';
    }
    result = user.setBDay(birthday_in);
    DB.newUser(id);
    user.save();
  }else{
    user.load();    // load before saving to not overwrite other data
    result = user.setBDay(birthday_in);
    user.save();
  }
  if (result) {
    await interaction.reply('Birthday was set')
  }else{
    await interaction.reply('Bad birthday format - use YYYY-MM-DD');
  }
});