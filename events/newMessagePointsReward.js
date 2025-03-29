import { Events } from 'discord.js';
import DB from '../DB.js';
import User from '../User.js';

const MessagePointsReward = 1;

export const name = Events.MessageCreate;
export const once = false;
export function execute(message) {
    let user = new User(message.author.id);
    if (!user.isExists()) {
        if (user.getID() < 0) {
            throw 'invalid user id';
        }
        DB.newUser(message.author.id);
        user.save();
    } else {
        user.load();
        user.setPoints(user.getPoints() + MessagePointsReward);
        user.save();
    }
}