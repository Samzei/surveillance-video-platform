const recordings = require("../data/recordings.json");

function getAllRecordings() {
    return recordings;
}

function getRecordingById(id) {
    return recordings.find((recording) => String(recording.id) === String(id));
}

module.exports = {
    getAllRecordings,
    getRecordingById,
};