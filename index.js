// for testing/easy configuration
import { token } from "./botinfo.js";
// for loading command files
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TOKEN = token;
import { IntentsBitField, Client, Collection, Events, MessageFlags } from 'discord.js';
const myIntents = new IntentsBitField();
myIntents.add(IntentsBitField.Flags.GuildMessages);
myIntents.add(IntentsBitField.Flags.GuildVoiceStates);
myIntents.add(IntentsBitField.Flags.GuildMembers);
myIntents.add(IntentsBitField.Flags.Guilds);
myIntents.add(IntentsBitField.Flags.MessageContent);
const bot = new Client({ intents: myIntents });

// slash commands handler
bot.commands = new Collection();

const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = join(commandsPath, file);
	const { data, execute } = await import(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if (data && execute) {
		bot.commands.set(data.name, { data, execute });
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

bot.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
	}
});

// bot events handler
import { CustomEventsInit } from "./utils/customEvents.js";
CustomEventsInit(bot);
const eventsPath = join(__dirname, 'events');
const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = join(eventsPath, file);
	const { name, once, execute } = await import(filePath);
	if (once) {
		bot.once(name, (...args) => execute(...args));
	} else {
		bot.on(name, (...args) => execute(...args));
	}
}

// Load database
import DB from "./DB.js";
DB.init_db(); // generate new db if non exists

// login the bot
bot.login(TOKEN);
