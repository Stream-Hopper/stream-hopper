
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;


DROP TABLE IF EXISTS DEVICE_TYPE;
CREATE TABLE DEVICE_TYPE (device_type_id INTEGER PRIMARY KEY UNIQUE NOT NULL, device_type_name STRING UNIQUE NOT NULL);
INSERT INTO DEVICE_TYPE (device_type_id, device_type_name) VALUES (1, 'USB');
INSERT INTO DEVICE_TYPE (device_type_id, device_type_name) VALUES (2, 'Lifx');
INSERT INTO DEVICE_TYPE (device_type_id, device_type_name) VALUES (3, 'Wemo');
INSERT INTO DEVICE_TYPE (device_type_id, device_type_name) VALUES (4, 'GPIO');


DROP TABLE IF EXISTS DEVICES;
CREATE TABLE DEVICES (device_id INTEGER PRIMARY KEY UNIQUE NOT NULL, device_name STRING UNIQUE NOT NULL, device_label STRING, device_type REFERENCES DEVICE_TYPE (device_type_id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL);
INSERT INTO DEVICES (device_id, device_name, device_label, device_type) VALUES (1, 'lab bulb', 'Lightbulb', 2);


DROP TABLE IF EXISTS PRESET_2_TRIGGER_MAP;
CREATE TABLE PRESET_2_TRIGGER_MAP (preset_id PRIMARY KEY REFERENCES PRESETS (preset_id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL, trigger_id INTEGER REFERENCES TRIGGERS (trigger_id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL);

DROP TABLE IF EXISTS PRESETS;
CREATE TABLE PRESETS (preset_id INTEGER PRIMARY KEY UNIQUE NOT NULL, preset_name STRING UNIQUE NOT NULL, default_preset BOOLEAN NOT NULL);
INSERT INTO PRESETS (preset_id, preset_name, default_preset) VALUES (1, 'Default Preset', 1);
INSERT INTO PRESETS (preset_id, preset_name, default_preset) VALUES (3, 'TEST PRESET', 0);


DROP TABLE IF EXISTS TRIGGER_ACTIONS;
CREATE TABLE TRIGGER_ACTIONS (trigger_action_id INTEGER PRIMARY KEY UNIQUE NOT NULL, "action" STRING NOT NULL, device_type INTEGER REFERENCES DEVICE_TYPE (device_type_id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL);
INSERT INTO TRIGGER_ACTIONS (trigger_action_id, "action", device_type) VALUES (1, 'setState', 2);
INSERT INTO TRIGGER_ACTIONS (trigger_action_id, "action", device_type) VALUES (2, 'togglePower', 2);
INSERT INTO TRIGGER_ACTIONS (trigger_action_id, "action", device_type) VALUES (3, 'breatheEffect', 2);
INSERT INTO TRIGGER_ACTIONS (trigger_action_id, "action", device_type) VALUES (4, 'moveEffect', 2);
INSERT INTO TRIGGER_ACTIONS (trigger_action_id, "action", device_type) VALUES (5, 'pulseEffect', 2);
INSERT INTO TRIGGER_ACTIONS (trigger_action_id, "action", device_type) VALUES (6, 'wemoOn', 3);
INSERT INTO TRIGGER_ACTIONS (trigger_action_id, "action", device_type) VALUES (7, 'wemoOff', 3);
INSERT INTO TRIGGER_ACTIONS (trigger_action_id, "action", device_type) VALUES (8, 'usbOn', 1);
INSERT INTO TRIGGER_ACTIONS (trigger_action_id, "action", device_type) VALUES (9, 'usbOff', 1);
INSERT INTO TRIGGER_ACTIONS (trigger_action_id, "action", device_type) VALUES (10, 'gpioOn', 4);
INSERT INTO TRIGGER_ACTIONS (trigger_action_id, "action", device_type) VALUES (11, 'gpioOff', 4);


DROP TABLE IF EXISTS TRIGGER_TYPE;
CREATE TABLE TRIGGER_TYPE (trigger_type_id INTEGER PRIMARY KEY UNIQUE NOT NULL, trigger_type_name STRING UNIQUE NOT NULL);
INSERT INTO TRIGGER_TYPE (trigger_type_id, trigger_type_name) VALUES (1, 'donation');
INSERT INTO TRIGGER_TYPE (trigger_type_id, trigger_type_name) VALUES (2, 'follow');
INSERT INTO TRIGGER_TYPE (trigger_type_id, trigger_type_name) VALUES (3, 'channelPointRedemption');
INSERT INTO TRIGGER_TYPE (trigger_type_id, trigger_type_name) VALUES (4, 'subscription');
INSERT INTO TRIGGER_TYPE (trigger_type_id, trigger_type_name) VALUES (5, 'cheer');
INSERT INTO TRIGGER_TYPE (trigger_type_id, trigger_type_name) VALUES (6, 'chatMessage');
INSERT INTO TRIGGER_TYPE (trigger_type_id, trigger_type_name) VALUES (7, 'resub');

DROP TABLE IF EXISTS TRIGGERS;
CREATE TABLE TRIGGERS (trigger_id INTEGER PRIMARY KEY UNIQUE NOT NULL, trigger_name STRING NOT NULL UNIQUE, device_id INTEGER REFERENCES DEVICES (device_id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL, trigger_type INTEGER REFERENCES TRIGGER_TYPE (trigger_type_id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL, trigger_action_id INTEGER REFERENCES TRIGGER_ACTIONS (trigger_action_id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL, options STRING);
INSERT INTO TRIGGERS (trigger_id, trigger_name, device_id, trigger_type, trigger_action_id, options) VALUES (1, 'test_trigger', 1, 6, 1, '#FFFFFF');
INSERT INTO TRIGGERS (trigger_id, trigger_name, device_id, trigger_type, trigger_action_id, options) VALUES (2, 'TEST TRIGGER 2', 1, 2, 2, '#BBBBBB');

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
