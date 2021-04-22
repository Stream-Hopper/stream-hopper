const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('./stream_hopper.db');

function device_INSERT(device_name,device_label, device_type) {
    let sql = `INSERT INTO DEVICES VALUES(NULL, ? , ? , ?);`;

    db.all(sql, [device_name,device_label, device_type], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log(row.name);
        });
    });
}