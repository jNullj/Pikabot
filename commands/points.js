import { SlashCommandBuilder } from 'discord.js';
import User from '../User.js';
import DB from "../DB.js";

export const data = new SlashCommandBuilder()
  .setName('points')
  .setDescription('Returns the number of points owned by user');
export async function execute(interaction) {
  let user = new User(interaction.member.id);
  if (!user.isExists()) {
    if (user.getID() < 0) {
      throw 'invalid user id';
    }
    DB.newUser(interaction.member.id);
    user.save();
  } else {
    user.load();
  }
  let points = user.getPoints();
  await interaction.reply('You have ' + points + ' points.');
}
