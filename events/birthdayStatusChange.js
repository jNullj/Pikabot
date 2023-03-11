const { Events } = require('discord.js');
const { isBirthdayCheckedToday, setLastBirthdayChecked } = require('../database/birthdayCheck.js');
const DB = require('../DB.js');

// call for the birthday handler each message
//TODO call the event only when needed
// cheaks for new/old birthdays and updates server
module.exports = {
	name: Events.MessageCreate,
	once: false,
	execute(message) {
        if (isBirthdayCheckedToday()) { return; }
        const birthdayRole = message.guild.roles.cache.find(role => role.name === 'BIRTHDAY');
        // remove old birthday kings 👑 from role
        birthdayRole.members.map(user => user.roles.remove(birthdayRole).catch(console.error));
        
        const today = new Date();
        const bdKings = DB.BDayOnDate(today);
        // not all members are fetched to cache by default
        // birthday kings might not be cached if they did not interact since last startup
        // as a fix fetch all current guild members prior to finding the members in cache
        message.guild.members.fetch().then(() => {
            bdKings.forEach(userId => {
                // if user birthday is today do the thing
                const birthdayUser = message.guild.members.cache.find(GuildMember => GuildMember.id == userId)
                birthdayUser.roles.add(birthdayRole);
                // let everyone know the member has a birthday
                const main_channel = message.guild.channels.cache.find(channel => channel.name == 'general');
                main_channel.send(`👑Happy Birthday ${birthdayUser}!👑`);
            });
        });

        // update last cheak date to today
        setLastBirthdayChecked(today);
	},
};