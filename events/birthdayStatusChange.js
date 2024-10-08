const { isBirthdayCheckedToday, setLastBirthdayChecked } = require('../utils/birthdayCheck.js');
const DB = require('../DB.js');
const { CustomEvent } = require('../utils/customEvents.js');
const { Colors } = require('discord.js');

// call for the birthday handler when the date changes
// cheaks for new/old birthdays and updates servers
module.exports = {
	name: CustomEvent.DateChange,
	once: false,
	execute(client) {
        if (isBirthdayCheckedToday()) { return; }
        client.guilds.cache.forEach(async guild => {
            let birthdayRole = await guild.roles.cache.find(role => role.name === 'BIRTHDAY');
             // If the role doesn't exist, create it
            if (!birthdayRole) {
                birthdayRole = await guild.roles.create({
                    name: 'BIRTHDAY',
                    color: Colors.Green,
                    hoist: true,
                    permissions: []
                });
                console.log(`Created missing role ${birthdayRole}`);
            }
            // remove old birthday kings 👑 from role
            await birthdayRole.members.map(user => user.roles.remove(birthdayRole).catch(console.error));
            
            const today = new Date();
            const bdKings = DB.BDayOnDate(today);
            // not all members are fetched to cache by default
            // birthday kings might not be cached if they did not interact since last startup
            // as a fix fetch all current guild members prior to finding the members in cache
            guild.members.fetch().then(() => {
                bdKings.forEach(userId => {
                    // if user birthday is today do the thing
                    const birthdayUser = guild.members.cache.find(GuildMember => GuildMember.id == userId)
                    birthdayUser.roles.add(birthdayRole);
                    // let everyone know the member has a birthday
                    const main_channel = guild.channels.cache.find(channel => channel.name == 'general');
                    main_channel.send(`👑Happy Birthday ${birthdayUser}!👑`);
                });
            });
        })
        // update last cheak date to today
        const today = new Date();
        setLastBirthdayChecked(today);
	},
};