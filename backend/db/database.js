const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dataDirectory = path.join(__dirname, '../data');
const databasePath = path.join(dataDirectory, 'stories.sqlite');

fs.mkdirSync(dataDirectory, { recursive: true });

const database = new Database(databasePath);

database.pragma('journal_mode = WAL');
database.exec(`
    CREATE TABLE IF NOT EXISTS stories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        town TEXT NOT NULL,
        ai_story TEXT NOT NULL,
        featured_place_json TEXT,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
        updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    )
`);

module.exports = database;