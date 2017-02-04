class User {
    constructor(id = -1 ,points = 0){
        this.id = id;
        this.points = points;
    }

    // GET
    getID(){
        return this.id;
    }
    getPoints(){
        return this.points;
    }

    // SET
    setID(id){
        this.id = id;
    }
   setPoints(points){
        this.points;
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
    }
    // Load user from db
    load(){
        const fs = require('fs');
        // load points
        var path = './db/points/' + this.id + ".txt";
        this.points = fs.readFileSync(path);
    }
}

module.exports = User;