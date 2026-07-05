const openDb = require("./db");

async function initDb() {
    const db = await openDb();

    await db.exec(`
        CREATE TABLE IF NOT EXISTS recordings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            camera TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            description TEXT,
            videoUrl TEXT NOT NULL,
            actions TEXT
        )
    `);

    const existingRecordings = await db.all("SELECT * FROM recordings");
    console.log(existingRecordings);

    if (existingRecordings.length === 0) {
        await db.run(
            `
            INSERT INTO recordings (camera, date, time, description, videoUrl, actions)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
                "Tapo C110",
                "12/03/2026",
                "14:32",
                "Real RTSP test recording from Tapo C110",
                "/videos/test.mp4",
                "person detected, movement, front door, rtsp test",
        );

        await db.run(
            `
            INSERT INTO recordings (camera, date, time, description, videoUrl, actions)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
                "Front Door Camera",
                "12/03/2026",
                "15:10",
                "Sample front door movement recording",
                "/videos/sample.mp4",
                "front door, movement, visitor, sample",
        );
    }

    console.log("SQLite database intialised");
}

module.exports = initDb;