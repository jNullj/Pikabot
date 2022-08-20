const { SlashCommandBuilder } = require('discord.js');

const User = require('../User.js');
const DB = require("../DB.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('points')
		.setDescription('Returns the number of points owned by user'),
	async execute(interaction) {
    let user = new User(interaction.member.id);
    if(!user.isExists()){
      if (user.getID() < 0) {
        throw 'invalid user id';
      }
      DB.newUser(interaction.member.id);
      user.save();
    }else{
      user.load();
    }
    let points = user.getPoints();
		await interaction.reply('You have ' + points + ' points.');
	},
};
