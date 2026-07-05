const openDb = require("../database/db");

async function getAllRecordings() {
    const db = await openDb();
    return db.all("SELECT * FROM recordings ORDER BY id DESC");
}

async function getRecordingById(id) {
    const db = await openDb();
    return db.get("SELECT * FROM recordings WHERE id = ?", [id]);
}

module.exports = {
    getAllRecordings,
    getRecordingById,
};