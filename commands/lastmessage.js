import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import DB from '../DB.js';

export const data = new SlashCommandBuilder()
    .setName('lastmessage')
    .setDescription('Show the last message time for a user (admin only)')
    .setDefaultMemberPermissions(0)
    .addUserOption(option => option
        .setName('user')
        .setDescription('User to lookup')
        .setRequired(true));

export async function execute(interaction) {
    // Validate caller is an admin in application DB
    if (!DB.isAdmin(interaction.user.id)) {
        await interaction.reply({ content: 'You are not authorized to use this command.', flags: MessageFlags.Ephemeral });
        return;
    }

    const target = interaction.options.getUser('user');
    if (!target) {
        await interaction.reply({ content: 'No user specified.', flags: MessageFlags.Ephemeral });
        return;
    }

    if (!DB.isUserExist(target.id)) {
        await interaction.reply({ content: `User <@${target.id}> does not exist in the application DB.`, flags: MessageFlags.Ephemeral });
        return;
    }

    const ts = DB.getLastMessage(target.id);
    if (!ts) {
        await interaction.reply({ content: `No last message record for <@${target.id}>.`, flags: MessageFlags.Ephemeral });
        return;
    }

    const dt = new Date(ts);
    await interaction.reply({ content: `<@${target.id}> last message: ${dt.toUTCString()}`, flags: MessageFlags.Ephemeral });
}
