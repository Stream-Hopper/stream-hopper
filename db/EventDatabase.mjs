import sqlite3 from 'sqlite3/lib/sqlite3.js';
import fetch from 'node-fetch';
import fs from 'fs';

const sql = sqlite3.verbose();

// Database Class Instance
class EventDatabase {
    constructor(databaseFile) {
        this.db = null;
        if (fs.existsSync(databaseFile)) {
            this.db = new sql.Database(databaseFile);
        } else {
            this.db = new sql.Database(databaseFile);
            this.create_database();
        }
        // When the Database is instantiated, make sure the
        // user_data table is in the database

    }

    ///////////////////////////////////////
    /// DEVICE QUERIES
    ///////////////////////////////////////
    device_INSERT(device_name, device_label, device_type) {
        let sql = `INSERT INTO DEVICES VALUES(NULL, ? , ? , ?);`;

        this.db.run(sql, [device_name, device_label, device_type], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            //console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    }

    device_UPDATE(device_id, device_name, device_label, device_type) {
        let sql = `UPDATE DEVICES SET device_name=?, device_label=?, device_type=? WHERE device_id=?;`;

        this.db.run(sql, [device_name, device_label, device_type, device_id], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            //console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    }

    device_DELETE(device_id) {
        let sql = `DELETE FROM DEVICES WHERE device_id=?;`;

        this.db.run(sql, [device_id], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            //console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    }

    ///////////////////////////////////////
    /// PRESETS QUERIES
    ///////////////////////////////////////
    presets_INSERT(preset_name, default_preset) {
        let sql = `INSERT INTO PRESETS VALUES(NULL,?,?);`;

        this.db.run(sql, [preset_name, default_preset], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            //console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    }

    presets_UPDATE(preset_id, preset_name, default_preset) {
        let sql = `UPDATE PRESETS SET preset_name=?, default_preset=? WHERE preset_id=?;`;

        this.db.run(sql, [preset_name, default_preset, preset_id], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            //console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    }

    presets_DELETE(preset_id) {
        let sql = `DELETE FROM PRESETS WHERE preset_id=?;`;

        this.db.run(sql, [preset_id], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            //console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    }

    ///////////////////////////////////////
    /// TRIGGERS QUERIES
    ///////////////////////////////////////
    triggers_INSERT(trigger_name, device_id, trigger_type, trigger_action_id, options,) {
        let sql = `INSERT INTO TRIGGERS VALUES(NULL,?,?,?,?,?);`;

        this.db.run(sql, [trigger_name, device_id, trigger_type, trigger_action_id, options], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            //console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    }

    triggers_UPDATE(trigger_name, device_id, trigger_type, trigger_action_id, options, trigger_id) {
        let sql = `UPDATE TRIGGERS SET trigger_name=?, device_id=?, trigger_type=?, trigger_action_id=?, options=? WHERE trigger_id=?;`;

        this.db.run(sql, [trigger_name, device_id, trigger_type, trigger_action_id, options, trigger_id], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            //console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    }

    triggers_DELETE(trigger_id) {
        let sql = `DELETE FROM TRIGGERS WHERE trigger_id=?;`;

        this.db.run(sql, [trigger_id], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            //.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    }

    ///////////////////////////////////////
    /// PRESET_2_TRIGGER_MAP QUERIES
    ///////////////////////////////////////
    P2TMAP_INSERT(trigger_id, preset_id) {
        let sql = `INSERT INTO PRESET_2_TRIGGER_MAP VALUES(NULL,?,?);`;

        this.db.run(sql, [preset_id, trigger_id], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            //console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    }

    P2TMAP_UPDATE(trigger_id, preset_id,map_id) {
        let sql = `UPDATE PRESET_2_TRIGGER_MAP SET trigger_id=?,preset_id=? WHERE map_id=?;`;

        this.db.run(sql, [trigger_id, preset_id,map_id], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            //console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    }

    P2TMAP_DELETE(preset_id, trigger_id) {
        let sql = `DELETE FROM PRESET_2_TRIGGER_MAP WHERE preset_id=? AND trigger_id=?;`;

        this.db.run(sql, [preset_id, trigger_id], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            //console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    }

    ///////////////////////////////////////
    /// SELECT QUERIES
    ///////////////////////////////////////
    listDevices() {
        let sql = `SELECT device_id, device_name FROM DEVICES;`;

        this.db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                console.log(row);
            });
        });
    }

    lisPresets() {
        let sql = `SELECT preset_id, preset_name FROM PRESETS;`;

        this.db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                console.log(row);
            });
        });
    }

    listTriggers() {
        let sql = `SELECT trigger_id, trigger_name FROM TRIGGERS;`;

        this.db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                console.log(row);
            });
        });
    }

    listDeviceType() {
        let sql = `SELECT device_type_id, device_type_name FROM DEVICE_TYPE;`;

        this.db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                console.log(row);
            });
        });
    }

    listTriggerType() {
        let sql = `SELECT trigger_type_id, trigger_type_name FROM TRIGGER_TYPE;`;

        this.db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                console.log(row);
            });
        });
    }
    
    listActionsPerDevice(device_id) {
        let sql = `SELECT trigger_action_id, action FROM TRIGGER_ACTIONS WHERE device_type = (SELECT device_type FROM DEVICES WHERE device_id=?);`;

        this.db.all(sql, [device_id], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                console.log(row);
            });
        });
    }

    listPresetsPreTrigger(trigger_id) {
        let sql = `SELECT preset_id, preset_name FROM PRESETS WHERE preset_id = (SELECT preset_id FROM PRESET_2_TRIGGER_MAP WHERE trigger_id = ?);`;

        this.db.all(sql, [trigger_id], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                console.log(row);
            });
        });
    }

    create_database() {
        this.db.serialize(() => {
            this.db.exec("PRAGMA foreign_keys = off\;" +
                "BEGIN TRANSACTION\;" +


                "DROP TABLE IF EXISTS DEVICE_TYPE\;" +
                "CREATE TABLE DEVICE_TYPE (device_type_id INTEGER PRIMARY KEY UNIQUE NOT NULL, device_type_name STRING UNIQUE NOT NULL)\;" +
                "INSERT INTO DEVICE_TYPE (device_type_id, device_type_name) VALUES (1, 'USB')\;" +
                "INSERT INTO DEVICE_TYPE (device_type_id, device_type_name) VALUES (2, 'Lifx')\;" +
                "INSERT INTO DEVICE_TYPE (device_type_id, device_type_name) VALUES (3, 'Wemo')\;" +
                "INSERT INTO DEVICE_TYPE (device_type_id, device_type_name) VALUES (4, 'GPIO')\;" +


                "DROP TABLE IF EXISTS DEVICES\;" +
                "CREATE TABLE DEVICES (device_id INTEGER PRIMARY KEY UNIQUE NOT NULL, device_name STRING UNIQUE NOT NULL, device_label STRING, device_type REFERENCES " + "DEVICE_TYPE (device_type_id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL)\;" +
                "INSERT INTO DEVICES (device_id, device_name, device_label, device_type) VALUES (1, 'lab bulb', 'Lightbulb', 2)\;" +


                "DROP TABLE IF EXISTS PRESET_2_TRIGGER_MAP\;" +
                "CREATE TABLE PRESET_2_TRIGGER_MAP (map_id INTEGER PRIMARY KEY NOT NULL UNIQUE, preset_id REFERENCES PRESETS (preset_id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL, trigger_id INTEGER REFERENCES TRIGGERS (trigger_id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL)\;" +

                "DROP TABLE IF EXISTS PRESETS\;" +
                "CREATE TABLE PRESETS (preset_id INTEGER PRIMARY KEY UNIQUE NOT NULL, preset_name STRING UNIQUE NOT NULL, default_preset BOOLEAN NOT NULL)\;" +
                "INSERT INTO PRESETS (preset_id, preset_name, default_preset) VALUES (1, 'Default Preset', 1)\;" +
                "INSERT INTO PRESETS (preset_id, preset_name, default_preset) VALUES (3, 'TEST PRESET', 0)\;" +


                "DROP TABLE IF EXISTS TRIGGER_ACTIONS\;" +
                "CREATE TABLE TRIGGER_ACTIONS (trigger_action_id INTEGER PRIMARY KEY UNIQUE NOT NULL, \"action\" STRING NOT NULL, device_type INTEGER REFERENCES DEVICE_TYPE " + "(device_type_id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL)\;" +
                "INSERT INTO TRIGGER_ACTIONS (trigger_action_id, \"action\", device_type) VALUES (1, 'setState', 2)\;" +
                "INSERT INTO TRIGGER_ACTIONS (trigger_action_id, \"action\", device_type) VALUES (2, 'togglePower', 2)\;" +
                "INSERT INTO TRIGGER_ACTIONS (trigger_action_id, \"action\", device_type) VALUES (3, 'breatheEffect', 2)\;" +
                "INSERT INTO TRIGGER_ACTIONS (trigger_action_id, \"action\", device_type) VALUES (4, 'moveEffect', 2)\;" +
                "INSERT INTO TRIGGER_ACTIONS (trigger_action_id, \"action\", device_type) VALUES (5, 'pulseEffect', 2)\;" +
                "INSERT INTO TRIGGER_ACTIONS (trigger_action_id, \"action\", device_type) VALUES (6, 'wemoOn', 3)\;" +
                "INSERT INTO TRIGGER_ACTIONS (trigger_action_id, \"action\", device_type) VALUES (7, 'wemoOff', 3)\;" +
                "INSERT INTO TRIGGER_ACTIONS (trigger_action_id, \"action\", device_type) VALUES (8, 'usbOn', 1)\;" +
                "INSERT INTO TRIGGER_ACTIONS (trigger_action_id, \"action\", device_type) VALUES (9, 'usbOff', 1)\;" +
                "INSERT INTO TRIGGER_ACTIONS (trigger_action_id, \"action\", device_type) VALUES (10, 'gpioOn', 4)\;" +
                "INSERT INTO TRIGGER_ACTIONS (trigger_action_id, \"action\", device_type) VALUES (11, 'gpioOff', 4)\;" +
                "DROP TABLE IF EXISTS TRIGGER_TYPE\;" +
                "CREATE TABLE TRIGGER_TYPE (trigger_type_id INTEGER PRIMARY KEY UNIQUE NOT NULL, trigger_type_name STRING UNIQUE NOT NULL)\;" +
                "INSERT INTO TRIGGER_TYPE (trigger_type_id, trigger_type_name) VALUES (1, 'donation')\;" +
                "INSERT INTO TRIGGER_TYPE (trigger_type_id, trigger_type_name) VALUES (2, 'follow')\;" +
                "INSERT INTO TRIGGER_TYPE (trigger_type_id, trigger_type_name) VALUES (3, 'channelPointRedemption')\;" +
                "INSERT INTO TRIGGER_TYPE (trigger_type_id, trigger_type_name) VALUES (4, 'subscription')\;" +
                "INSERT INTO TRIGGER_TYPE (trigger_type_id, trigger_type_name) VALUES (5, 'cheer')\;" +
                "INSERT INTO TRIGGER_TYPE (trigger_type_id, trigger_type_name) VALUES (6, 'chatMessage')\;" +
                "INSERT INTO TRIGGER_TYPE (trigger_type_id, trigger_type_name) VALUES (7, 'resub')\;" +
                "DROP TABLE IF EXISTS TRIGGERS\;" +
                "CREATE TABLE TRIGGERS (trigger_id INTEGER PRIMARY KEY UNIQUE NOT NULL, trigger_name STRING NOT NULL UNIQUE, device_id " +
                "   INTEGER REFERENCES DEVICES (device_id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL, trigger_type INTEGER REFERENCES " +
                "TRIGGER_TYPE (trigger_type_id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL, trigger_action_id INTEGER REFERENCES " +
                "TRIGGER_ACTIONS (trigger_action_id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL, options STRING)\;" +
                "INSERT INTO TRIGGERS (trigger_id, trigger_name, device_id, trigger_type, trigger_action_id, options) VALUES (1, 'test_trigger', 1, 6, 1, '#FFFFFF')\;" +
                "INSERT INTO TRIGGERS (trigger_id, trigger_name, device_id, trigger_type, trigger_action_id, options) VALUES (2, 'TEST TRIGGER 2', 1, 2, 2, '#BBBBBB')\;" +
                "DROP TABLE IF EXISTS USER\;" +
                "COMMIT TRANSACTION\;" +
                "PRAGMA foreign_keys = on;");
        });
        console.log('Success');
    }

}

/*
var EventDB = new EventDatabase('streamhopper.sqlite');
let row, err = EventDB.queryDatabase((rows) => {
  if (rows){
    console.log(rows)
    return;
  }
  console.log('0 Rows...')
});

*/

export default { EventDatabase };