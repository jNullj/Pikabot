var SQL = require('better-sqlite3'); // Load sqlite module
const DB_FILE = 'database.db'; // DB File name

class DB {
    // Connect to DB
    static connect(){
        return new SQL(DB_FILE);
    }
    // Disconnect to DB
    static disconnect(db){
        db.close();
    }
    // set points for user
    static setPoints(uid, points){
        var sql = `UPDATE users
                    SET points = ?
                    WHERE id = ?`;
        var db = this.connect();
        db.prepare(sql).run(points, uid);
        this.disconnect(db);
    }
    // set birthday for user
    static setBirthday(uid, date){
        var sql = `UPDATE users
                    SET birthday = ?
                    WHERE id = ?`;
        var db = this.connect();
        db.prepare(sql).run(date, uid);
        this.disconnect(db);
    }
    // get points for user
    static getPoints(uid){
        var sql = `SELECT points
                    FROM users
                    WHERE id = ?`;
        var db = this.connect();
        var row = db.prepare(sql).get(uid);
        this.disconnect(db);
        return row.points;
    }
    // get birthday for user
    static getBirthday(uid){
        var sql = `SELECT birthday
                    FROM users
                    WHERE id = ?`;
        var db = this.connect();
        var row = db.prepare(sql).get(uid);
        this.disconnect(db);
        return row.birthday;
    }
    // cheak if user exists in db, returns bool
    static isUserExist(uid){
        var sql = `SELECT CAST(id AS TEXT) id
                    FROM users
                    WHERE id = ?`;
        var db = this.connect();
        var row = db.prepare(sql).get(uid);
        this.disconnect(db);
        if (row === undefined){     // accurding to better-sqlite3 returns undefined if results was empty
            return false;           // if row is undefined the sucssesful quary is empty, user doesnt exists
        }else{
            return true;            // else the user was retrieved from the db, user exists in db
        }
    }
    static newUser(uid){
        console.log("New User With ID: " + uid);
        var sql = `INSERT INTO users(id, points, birthday) VALUES(?,0,-1)`;
        var db = this.connect();
        db.prepare(sql).run(uid);
        this.disconnect(db);
    }
    static BDayOnDate(date){
        var result = [];
        var sql = `SELECT id
                    FROM users
                    WHERE birthday LIKE ?`;
        var db = this.connect();
        var row = db.prepare(sql).all('%'+date);
        this.disconnect(db);
        row.forEach((row) => {
            result.push(row.id);
        });
        return result;
    }

    static isSelfAddChannel(channel_id){
        var sql = `SELECT id
                    FROM selfAddChannels
                    WHERE id = ?`;
        var db = this.connect();
        var row = db.prepare(sql).get(channel_id);
        this.disconnect(db);
        if (row === undefined){     // accurding to better-sqlite3 returns undefined if results was empty
            return false;           // if row is undefined the sucssesful quary is empty, user doesnt exists
        }else{
            return true;            // else the user was retrieved from the db, user exists in db
        }
    }

    static getSelfAddChannels(){
        var result = [];
        var sql = `SELECT CAST(id AS TEXT) id
                    FROM selfAddChannels`;
        var db = this.connect();
        var row = db.prepare(sql).all();
        this.disconnect(db);
        row.forEach((row) => {
            result.push(row.id);
        });
        return result;
    }
}

module.exports = DB;
