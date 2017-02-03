function User(name = "empty" ,points = 0){
    this.name = name;
    this.points = points;
}

// GET
User.prototype.getName = function(){
    return this.name;
}
User.prototype.getPoints = function(){
    return this.points;
}

// SET
User.prototype.setName = function(name){
    this.name = name;
}
User.prototype.setPoints = function(points){
    this.points;
}

// DB

// Cheak if the user exists in the db
User.prototype.isExists = function(){
    const fs = require('fs');
    var path = '/db/points/' + this.name + ".txt";
    return fs.existsSync(path);
}
// Save user to db
User.prototype.save = function(){
    const fs = require('fs');
    // save points
    var path = '/db/points/' + this.name + ".txt";
    var data = this.points;
    fs.writeFile(path, data, function(err){if(err){return err;}});
}
// Load user from db
User.prototype.load = function(){
    const fs = require('fs');
    // load points
    var path = '/db/points/' + this.name + ".txt";
    fs.readFile(path, (err, data) => {
        if (err) throw err;
        this.points = data;
    });
}