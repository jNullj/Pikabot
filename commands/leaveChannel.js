import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } from 'discord.js';
import DB from '../DB.js';

export const data = new SlashCommandBuilder()
    .setName('leave-channels')
    .setDescription('Leave a private channel');
export async function execute(interaction) {
    let selectOptions = [];
    let channel_list = DB.getSelfAddChannels();
    channel_list.forEach(channelId => {
        let channel = interaction.guild.channels.cache.get(channelId);
        if (!channel.members.has(interaction.member.id)) { return; }
        let channelName = channel.name;
        selectOptions.push({
            label: channelName,
            description: channelName,
            value: channelId
        });
    });
    if (selectOptions.length === 0) {
        await interaction.reply('You did not join any channel you can leave');
        return;
    }
    const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('leaveChannelSelectMenu')
                .setPlaceholder('Please select a channel to leave')
                .addOptions(selectOptions));
    // deny access to users who did not call the request
    const filter = i => {
        i.deferUpdate();
        return i.user.id === interaction.user.id;
    };
    // send the select menu
    await interaction.reply({ content: 'Please select a channel:', components: [row] })
        .then(message => {
            // wait 60 seconds for a response
            return message.awaitMessageComponent({ filter, componentType: ComponentType.StringSelect, time: 60000 });
        })
        .then(collected => {
            return new Promise((resolve, reject) => {
                let channel = interaction.guild.channels.cache.get(collected.values[0]);
                let user = collected.user;
                if (channel != undefined && DB.isSelfAddChannel(channel.id)) {
                    const newPermision = { ViewChannel: false };
                    channel.permissionOverwrites.edit(user, newPermision);
                    resolve([user, channel]);
                } else {
                    reject('wrong channel selected');
                }
            });
        })
        .then(([user, channel]) => {
            interaction.editReply({
                content: `${user.toString()} left ${channel.toString()}!`,
                components: [],
            });
        })
        .catch(err => {
            if (err.code == 'InteractionCollectorError') {
                interaction.editReply({ content: 'Timed out - no channel selected', components: [] });
            } else {
                console.log(err);
            }

        });
}
