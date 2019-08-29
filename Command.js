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
}

module.exports = Command;

