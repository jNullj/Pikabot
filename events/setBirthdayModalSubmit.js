import { Events } from 'discord.js';
import DB from '../DB.js';
import User from '../User.js';

// handle set-birthday modal sumbit
export const name = Events.InteractionCreate;
export const once = false;
export async function execute(interaction) {
    // Ignore non-submit interactions and non-set-birthday modals
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId !== 'set-birthday-model') return;
    // Extract user's input and ID
    const birthday_in = interaction.fields.getTextInputValue('birthday-text-input');
    const id = interaction.user.id;
    let result;
    let user = new User(id);
    if (!user.isExists()) {
        // If user is new, create a new record and set their birthday
        if (user.getID() < 0) {
            throw 'invalid user id';
        }
        result = user.setBDay(birthday_in);
        DB.newUser(id);
        user.save();
    } else {
        // If user already exists, update their birthday
        user.load(); // load before saving to not overwrite other data
        result = user.setBDay(birthday_in);
        user.save();
    }
    // Respond to user with success or error message
    if (result) {
        await interaction.reply('Birthday was set');
    } else {
        await interaction.reply('Bad birthday format - use YYYY-MM-DD');
    }
}