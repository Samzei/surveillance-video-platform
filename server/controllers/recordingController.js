const recordingService = require("../services/recordingService");

function getAllRecordings(req, res) {
    const recordings = recordingService.getAllRecordings();
    res.json(recordings);
}

function getRecordingById(req, res) {
    const {id} = req.params;

    const recording = recordingService.getRecordingById(id);

    if (!recording) {
        return res.status(404).json({
            message: "Recording not found",
        });
    }

    res.json(recording);
}

module.exports ={
    getAllRecordings,
    getRecordingById,
};