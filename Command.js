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
}

module.exports = Command;