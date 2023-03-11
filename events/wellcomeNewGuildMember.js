const { Events } = require('discord.js');

const wellcomeMessageChannelName = 'general';   // The channel to wellcome new users at

// When a new guild member joins (added) wellcome them
module.exports = {
	name: Events.GuildMemberAdd,
	once: false,
	execute(member) {
        // Send the message to a designated channel on a server:
        const channel = member.guild.channels.cache.find(ch => ch.name === wellcomeMessageChannelName);
        // Do nothing if the channel wasn't found on this server
        if (!channel) return;
        // Send the message, mentioning the member
        channel.send(`Welcome to the server, ${member}`);
	},
};