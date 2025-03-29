import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('pikabot-commands')
    .setDescription('List all pikabot commands');
export async function execute(interaction) {
    let output = "";
    for (let command of interaction.client.commands.values()) {
        output += "/" + command.data.name;
        output += " - ";
        output += command.data.description;
        output += "\n";
    }
    await interaction.reply('Here are all of pikabots commands:\n' + output);
}
