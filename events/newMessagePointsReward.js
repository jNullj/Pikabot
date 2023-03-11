const { Events } = require('discord.js');
const DB = require('../DB.js');
const User = require('../User.js');

const MessagePointsReward = 1;

module.exports = {
	name: Events.MessageCreate,
	once: false,
	execute(message) {
        let user = new User(message.author.id);
        if(!user.isExists()){
            if (user.getID() < 0) {
                throw 'invalid user id';
            }
            DB.newUser(message.author.id);
            user.save();
        }else{
            user.load();
            user.setPoints(user.getPoints() + MessagePointsReward);
            user.save();
        }
	},
};