// Load database
const DB = require("./DB.js");

class User {
    constructor(id = -1 ,points = 0){
        this.id = id;
        this.points = points;
        this.birthday = -1; //default birthday to -1 to show unset
    }

    // GET
    getID(){
        return this.id;
    }
    getPoints(){
        return this.points;
    }
    getBDay(){
        return this.birthday;
    }

    // SET
    setID(id){
        this.id = id;
    }
   setPoints(points){
        this.points = points;
    }
    setBDay(birthday){
        if (this.checkDateFormat(birthday)) {
            this.birthday = birthday;
            return true;
        }else{
            return false;
        }
    }

    // DB

    // Cheak if the user exists in the db
    isExists(){
        return DB.isUserExist(this.id);
    }
    // Save user to db
    save(){
        DB.setPoints(this.id, this.points);
        DB.setBirthday(this.id, this.birthday);
        return;
    }
    // Load user from db
    load(){
        this.points = DB.getPoints(this.id);
        this.birthday = DB.getBirthday(this.id);
        return;
    }

    //utilitys
    checkDateFormat(mydate){
        var iso_format = /^(\d{4})-([0-1]\d)-([0-3]\d)$/;
        var parts = String(mydate).match(iso_format);
        if (parts == null) {
            return false; // not a valid format
        }
        return true;
    }
}

module.exports = User;
