// Load database
const DB = require("./DB.js");
// file locations
const SOUND_FOLDER = './sounds/';
// load packages
const fs = require('fs');
const path = require('path');
// load voice
const { createAudioResource, createAudioPlayer, joinVoiceChannel, VoiceConnectionStatus, AudioPlayerStatus, getVoiceConnection, entersState } = require('@discordjs/voice');

class Command {
    static findBDayKing(){
        var result;
        var d = new Date();
        var today = d.toISOString().substring(0,10);
        var today_date = today.substring(5,10);
        result = DB.BDayOnDate(today_date);
        return result;
    }

    static async doPikaNoise(vchannel){
        if(vchannel==undefined){ console.log("pikanoise missing channel"); return; } //avoid crushing when vc is missing

        // find all sound files
        var sound_files = [];
        fs.readdirSync(SOUND_FOLDER).forEach(file => {
          const relativeFilePath = SOUND_FOLDER + file;
          if(path.extname(relativeFilePath).toLowerCase()=='.wav'){
            sound_files.push(relativeFilePath);
          }
        });
        if(sound_files.length===0){
          // no sound files found, nothing to do
          return;
        }
        // pick one random file to play
        let rand = Math.random() * sound_files.length;
        var i = Math.floor(rand % sound_files.length); //get random index from array
        const player = createAudioPlayer()
        const connection = joinVoiceChannel({
            channelId: vchannel.id,
            guildId: vchannel.guild.id,
            adapterCreator: vchannel.guild.voiceAdapterCreator
        });
        connection.subscribe(player);
        let resource = createAudioResource(sound_files[i]);
        try {
            await entersState(connection, VoiceConnectionStatus.Ready, 300e3);
            player.play(resource)
            await entersState(player, AudioPlayerStatus.Playing, 200e3)
        } catch (error) {
            connection.destroy();
            console.log(error);
        }
        player.on(AudioPlayerStatus.Idle, () => {
            connection.destroy()
        });
    }
}

module.exports = Command;
