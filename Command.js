const User = require('./User.js');

class Command {
    static getPoints(id){
        var user = new User(id);
        if(!user.isExists()){
            if (user.getID() < 0) {
                throw 'invalid user id';
            }
            user.save();
        }else{
            user.load();
        }
        return user.getPoints();
    }
    
    static setBDay(id, bdate){
        var result;
        var user = new User(id);
        if(!user.isExists()){
            if (user.getID() < 0) {
                throw 'invalid user id';
            }
            result = user.setBDay(bdate);
            user.save();
        }else{
            user.load();    // load before saving to not overwrite other data
            result = user.setBDay(bdate);
            user.save();
        }
        return result;
    }
	
	static praise(message,id, deity){
		var result;
		var user = new User(id);
		var points;
		if(!user.isExists()){
			if (user.getID() < 0){
				throw 'invalid user ID';
			}
		}else{
			user.load();
		}
		points = user.getPoints();
		var name=deity.toUpperCase();   //Set to uppercase to ignore case sensitive
		switch (name) {
			case 'LORD PIKACHU':
			case 'LORDPIKA':
				points++;
				user.setPoints(points);
				message.reply('You praise the Lord Pikachu and feel the electricity flow through you! Gained one point.');
				break;
			case 'HATSUNE MIKU':
			case 'MIKU':
				points++;
				user.setPoints(points);
				message.reply('You praise divine songstress Hatsune Miku. You hear a song in your heart. Gained one point.');
				break;
			default:
				if (points == 0)
					message.reply('You praise an unknown deity, and would have lost a point if you had any, peasant!');
				else{
					points--;
					user.setPoints(points);
					message.reply('You praise an unknown deity. Heathen! Lost one point.');
				}break;
		}
		user.save();
	}
}

module.exports = Command;

