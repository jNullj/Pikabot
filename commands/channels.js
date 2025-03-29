import { SlashCommandBuilder } from 'discord.js';
import DB from '../DB.js';

export const data = new SlashCommandBuilder()
  .setName('channels')
  .setDescription('Returns a list of private channels you can join');
export async function execute(interaction) {
  let channel_list = DB.getSelfAddChannels();
  let channel_list_str = "";
  channel_list.forEach(channel => {
    channel_list_str += interaction.guild.channels.cache.get(channel).toString();
    channel_list_str += " ";
  });
  await interaction.reply('Here is a list of private channels:\n' +
    channel_list_str + '\n' +
    'To join them use the /joinChannel <channel> command');
}
