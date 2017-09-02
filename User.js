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
        if (points<0) {
            // cheak if set point is negative, if so dont set it
            return false;
        }
        this.points = points;
    }
    setBDay(birthday){
        if (this.cheakDateFormat(birthday)) {
            this.birthday = birthday;
            return true;
        }else{
            return false;
        }
    }

    // DB

    // Cheak if the user exists in the db
    isExists(){
        const fs = require('fs');
        var path = './db/points/' + this.id + ".txt";
        return fs.existsSync(path);
    }
    // Save user to db
    save(){
        const fs = require('fs');
        // save points
        var path = './db/points/' + this.id + ".txt";
        var data = this.points;
        fs.writeFile(path, data, (err) => {if(err){return err;}});
        // save birthday
        var path = './db/birthday/' + this.id + ".txt";
        var data = this.birthday;
        fs.writeFile(path, data, (err) => {if(err){return err;}});
    }
    // Load user from db
    load(){
        const fs = require('fs');
        // load points
        var path = './db/points/' + this.id + ".txt";
        this.points = fs.readFileSync(path);
        // load birthday if exists
        var path = './db/birthday/' + this.id + ".txt";
        if (fs.existsSync(path)) {    //cheak if birthday exists for user
            this.birthday = fs.readFileSync(path);
        }
    }

    //utilitys
    cheakDateFormat(mydate){
        var iso_format = /^(\d{4})-([0-1]\d)-([0-3]\d)$/;
        var parts = String(mydate).match(iso_format);
        if (parts == null) {
            return false; // not a valid format
        }
        return true;
    }
}

module.exports = User;

