const User = require('./User.js');
// Load database
const DB = require("./DB.js");

class Command {
    static getPoints(id){
        var user = new User(id);
        if(!user.isExists()){
            if (user.getID() < 0) {
                throw 'invalid user id';
            }
            DB.newUser(id);
            user.save();
        }else{
            user.load();
        }
        return user.getPoints();
    }

    static addPoints(id, points){
        var user = new User(id);
        if(!user.isExists()){
            if (user.getID() < 0) {
                throw 'invalid user id';
            }
            DB.newUser(id);
            user.save();
        }else{
            user.load();
            user.setPoints(user.getPoints() + points);
            user.save();
        }
    }

    static setBDay(id, bdate){
        var result;
        var user = new User(id);
        if(!user.isExists()){
            if (user.getID() < 0) {
                throw 'invalid user id';
            }
            result = user.setBDay(bdate);
            DB.newUser(id);
            user.save();
        }else{
            user.load();    // load before saving to not overwrite other data
            result = user.setBDay(bdate);
            user.save();
        }
        return result;
    }

    static findBDayKing(){
        var result;
        var d = new Date();
        var today = d.toISOString().substring(0,10);
        var today_date = today.substring(5,10);
        result = DB.BDayOnDate(today_date);
        return result;
    }

    static addMemberToPrivateChannel(member, channel){
        const newPermision = { VIEW_CHANNEL: true };
        channel.updateOverwrite(member, newPermision);
    }

    static removeMemberFromPrivateChannel(member, channel){
        const newPermision = { VIEW_CHANNEL: false };
        channel.updateOverwrite(member, newPermision);
    }

    static addToPrivateChannel(msg){
      // isolate the date from the command
        var regex = /!joinChannel (.*)/;
        var channel_name = msg.content.match(regex)[1];
        var channel = msg.guild.channels.cache.find(
          channel => channel.name === channel_name);
        if(channel != undefined && DB.isSelfAddChannel(channel.id)){
          this.addMemberToPrivateChannel(msg.author, channel);
          msg.reply("I added you to " + channel.toString());
        }else{
          msg.reply("Wrong channel was requested");
        }
    }

    static removeFromPrivateChannel(msg){
      // isolate the date from the command
        var regex = /!leaveChannel (.*)/;
        var channel_name = msg.content.match(regex)[1];
        var channel = msg.guild.channels.cache.find(
          channel => channel.name === channel_name);
        if(channel != undefined && DB.isSelfAddChannel(channel.id)){
          this.removeMemberFromPrivateChannel(msg.author, channel);
          msg.reply("I removed you from " + channel.toString());
        }else{
          msg.reply("Wrong channel!");
        }
    }

    static privateChannelsString(client){
        let channel_list = DB.getSelfAddChannels();
        let result = "";
        channel_list.forEach(channel => {
          result += client.channels.cache.get(channel).toString();
          result += " ";
        });
        return result;
    }
}

module.exports = Command;
