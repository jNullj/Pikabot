const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');

const DB = require('../DB.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join-channels')
		.setDescription('Join a private channel'),
	async execute(interaction) {
        let selectOptions = [];
        let channel_list = DB.getSelfAddChannels();
        channel_list.forEach(channelId => {
            let channelName = interaction.guild.channels.cache.get(channelId).name
            selectOptions.push({
                label: channelName,
                description: channelName,
                value: channelId
            });
          });
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('joinChannelSelectMenu')
                    .setPlaceholder('Please select a channel to join')
                    .addOptions(selectOptions),
            );
        // deny access to users who did not call the request
        const filter = i => {
            i.deferUpdate();
            return i.user.id === interaction.user.id;
        };
        // send the select menu
        await interaction.reply({ content: 'Please select a channel:', components: [row] })
            .then(message => {
                // wait 60 seconds for a response
                return message.awaitMessageComponent({ filter, componentType: ComponentType.StringSelect, time: 60000 })
            })
            .then(collected => { return new Promise((resolve, reject) => {
                let channel = interaction.guild.channels.cache.get(collected.values[0]);
                let user = collected.user;
                if(channel != undefined && DB.isSelfAddChannel(channel.id)){
                    const newPermision = { ViewChannel: true };
                    channel.permissionOverwrites.edit(user, newPermision);
                    resolve([user, channel]);
                }else{
                    reject('wrong channel selected');
                }
            })})
            .then(([user, channel]) => {
                interaction.editReply({
                    content: `${user.toString()} joined ${channel.toString()}!`,
                    components: [],
                })
            })
            .catch(err => {
                if (err.code == 'InteractionCollectorError') {
                    interaction.editReply({ content: 'Timed out - no channel selected', components: [] });
                }else{
                    console.log(err);
                }
                
            });
	},
};
