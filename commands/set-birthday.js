const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-birthday')
		.setDescription('Tell pikabot your birthday for a suprise'),
	async execute(interaction) {
        // create user model
        const model = new ModalBuilder()
            .setCustomId('set-birthday-model')
            .setTitle('Birthday fun form');
        // add fields
        const row = new ActionRowBuilder()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId('birthday-text-input')
                    .setPlaceholder('YYYY-MM-DD - year month day')
                    .setLabel('Birthday in format')
                    .setStyle(TextInputStyle.Short),
            );
        model.addComponents(row);

        //show model
        await interaction.showModal(model);
	},
};
