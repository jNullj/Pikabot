import { SlashCommandBuilder } from 'discord.js'
import DB from "../DB.js"

export const data = new SlashCommandBuilder()
    .setName('highscore')
    .setDescription('Posts points highscore')
export async function execute(interaction) {
    let scores = DB.getHighscore(5)
    let highscore = 'Highscore:\n'
    scores.forEach((score, index) => {
        highscore += `${index + 1}. <@${score.id}>: ${score.points}`
        if (index == 0) {
            highscore += ' 👑'
        } else if (index == 1) {
            highscore += ' 🥈'
        } else if (index == 2) {
            highscore += ' 🥉'
        }
        highscore += '\n'
    })
    await interaction.reply(highscore)
}
