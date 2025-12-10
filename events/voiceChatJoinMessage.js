import { createAudioPlayer, joinVoiceChannel, createAudioResource, entersState, AudioPlayerStatus, VoiceConnectionStatus } from '@discordjs/voice';
import { Events } from 'discord.js';
import { pickRandomFile } from '../utils/path.js';
import DB from '../DB.js';
const SOUND_FOLDER = './sounds/';

export const name = Events.VoiceStateUpdate;
export const once = false;
export async function execute(oldState, newState) {
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
    // record last voice join timestamp
    try {
        DB.setLastVoice(newState.member.id, Date.now());
    } catch (err) {
        console.error('Failed to record last voice join:', err);
    }
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
}