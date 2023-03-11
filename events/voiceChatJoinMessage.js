const { createAudioPlayer, joinVoiceChannel, createAudioResource, entersState, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const { Events } = require('discord.js');
const { pickRandomFile } = require('../utils/path.js');
const SOUND_FOLDER = './sounds/';

module.exports = {
	name: Events.VoiceStateUpdate,
	once: false,
	async execute(oldState, newState) {
        // get state change channels
        const oldChannel = oldState.channelId;
        const newChannel = newState.channelId;
        // check if user joined chat or change state for another reason
        // only joining users has no old channel but does have a new one
        // this is the eq to !(old=null && new != null)
        if (oldChannel !== null || newChannel === null) { return; }
        // dont triger from bots
        if (newState.member.user.bot === true) { return; }
        // user joined voice chat, wellcome them
        const audioFile = pickRandomFile(SOUND_FOLDER, ['.wav']);
        if (!audioFile) { console.error('No audio files found for voiceChatJoinMessage'); return; }
        const player = createAudioPlayer();
        const connection = joinVoiceChannel({
            channelId: newState.channelId,
            guildId: newState.guild.id,
            adapterCreator: newState.guild.voiceAdapterCreator
        });
        connection.subscribe(player);
        let resource = createAudioResource(audioFile);
        try {
            await entersState(connection, VoiceConnectionStatus.Ready, 300e3);
            player.play(resource);
            await entersState(player, AudioPlayerStatus.Playing, 200e3);
        } catch (error) {
            connection.destroy();
            console.log(error);
        }
        player.on(AudioPlayerStatus.Idle, () => {
            connection.destroy();
        });
	},
};