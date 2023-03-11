var SQL = require('better-sqlite3'); // Load sqlite module
const DB_FILE = 'database/database.db'; // DB File name
const DB_INIT_FILE = 'db_creation.sql'; // DB creation instructions

class DB {
    static init_db() {
        // check if db exists, if not create it
        const fs = require('fs') // import fs to check if db exists and read db init file
        try {
            if (!fs.existsSync(DB_FILE)) {
                console.log('DB file does not exist, creating new DB.')
                // db does not exist, create it
                const sql = fs.readFileSync(DB_INIT_FILE, 'utf8')
                let db = this.connect()
                db.exec(sql)
                this.disconnect(db)
                console.log('new DB created at ' + DB_FILE)
            }
        } catch(v) {
            console.error(v)
        }
    }
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

    /**
     * Find all users who have a birthday on a specified date
     * 
     * @param {Date} date - Date to search for users who have birthday
     * @returns {number[]} - Array of discord user ids who have birthday on provided date
     */
    static BDayOnDate(date){
        const result = [];
        const month = date.getMonth() + 1; // Add 1 to convert from 0-based to 1-based index
        const day = date.getDate();
        const sql = `SELECT id
                    FROM users
                    WHERE SUBSTR(birthday, 6, 2) = ?
                    AND SUBSTR(birthday, 9) = ?`;
        var db = this.connect();
        const row = db.prepare(sql).all(month.toString().padStart(2, '0'), day.toString().padStart(2, '0'));
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
