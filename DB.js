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
        if (row.id == uid){
            return true;
        }else{
            return false;
        }
    }
    static newUser(uid){
        console.log("New User With ID: " + uid);
        var sql = `INSERT INTO users(id, points, birthday) VALUES(?,0,-1)`;
        var db = this.connect();
        db.prepare(sql).run(uid);
        this.disconnect(db);
    }
}

module.exports = DB;
