const User = require('./User.js');

class Command {
    static getPoints(id){
        var user = new User(id);
        user.load();
        return user.getPoints();
    }
}

module.exports = Command;