import sqlite3 from 'sqlite3/lib/sqlite3.js';
import fetch from 'node-fetch';

const sql = sqlite3.verbose();

// Database Class Instance
class Database{
  constructor(databaseFile){
    this.db = new sql.Database(databaseFile);
    // When the Database is instantiated, make sure the
    // user_data table is in the database
    this.db.serialize(() => {
      this.db.run("CREATE TABLE IF NOT EXISTS `user_data` "
      + "(`user_id` INTEGER PRIMARY KEY AUTOINCREMENT,"
      + "`twitch_access_token` VARCHAR(50) NULL,"
      + "`twitch_refresh_token` VARCHAR(50) NULL,"
      + "`twitch_channel_username` VARCHAR(50) NULL,"
      + "`twitch_channel_id` VARCHAR(50) NULL,"
      + "`twitch_client_id` VARCHAR(50) NULL,"
      + "`twitch_client_secret` VARCHAR(50) NULL,"
      + "`streamlabs_access_token` VARCHAR(50) NULL,"
      + "`streamlabs_socket_token` VARCHAR(50) NULL,"
      + "`streamlabs_client_secret` VARCHAR(50) NULL,"
      + "`streamlabs_client_id` VARCHAR(50) NULL,"
      + "`streamlabs_refresh_token` VARCHAR(50) NULL)");
    });
  }

  insertData(streamlabsClientID, streamlabsClientSecret, streamlabsSocketToken, twitchClientID, twitchClientSecret, twitchChannelUsername, twitchUserID){
    this.db.serialize(() => {
      this.db.run("INSERT INTO `user_data` (twitch_access_token, "
        + "twitch_refresh_token, twitch_channel_username, "
        + "twitch_channel_id, twitch_client_id, twitch_client_secret, "
        + "streamlabs_access_token, streamlabs_socket_token, "
        + "streamlabs_client_secret, streamlabs_client_id, "
        + "streamlabs_refresh_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        null, null, twitchChannelUsername,
        twitchUserID, twitchClientID, twitchClientSecret,
        null, streamlabsSocketToken, streamlabsClientSecret,
        streamlabsClientID, null);
    });
  }

  editData(newValues){
    var query = "UPDATE `user_data` SET";
    let count = 0;
    let size = Object.keys(newValues).length;
    if (size == 0){
      return;
    }
    Object.keys(newValues).forEach(k =>  {
      count += 1;
      query += (count == size) ? ` ${k} = '${newValues[k]}' ` : ` ${k} = '${newValues[k]}', `;
    });
    query += " WHERE `user_data`.`user_id` = 1";
    this.db.run(query);
  }

  queryDatabase(callback){
    let rows = [];
    this.db.each("SELECT * FROM `user_data`", (err, row) => {
      rows.push(row);
    }, () => {
      callback(rows);
    });
  }
}

export default { Database };


