const recordingService = require("../services/recordingService");
const captureService = require("../services/captureService");

async function getAllRecordings(req, res) {
    try {
        const recordings = await recordingService.getAllRecordings();
        res.json(recordings);
    } catch (error) {
        console.error("Error fetching recordigns:", error);
        res.status(500).json({ message: "Server error while fetching recordings"});
    }   
}

async function getRecordingById(req, res) {
    try {
        const {id} = req.params;

        const recording = await recordingService.getRecordingById(id);

        if (!recording) {
            return res.status(404).json({
                message: "Recording not found",
            });
        }

        res.json(recording);        
    } catch (error) {
        console.error("Error fetching recording:", error);
        res.status(500).json({ message: "Server error while fetching recording"});
    }

}

async function captureRecording(req, res) {
    try {
        const requestedDuration = Number(req.body.duration ?? 15);

        if (
            !Number.isFinite(requestedDuration) ||
            requestedDuration < 5 ||
            requestedDuration > 60
        ) {
            return res.status(400).json({
                message: "Duration must be between 5 and 60 seconds.",
            });
        }

        const result = await captureService.captureRecording(
            requestedDuration
        );

        res.status(201).json({
            message: "Recording completed successfully.",
            recording: result,
        });
    } catch (error) {
        console.error("Camera capture failed:", error );
        
        res.status(500).json({
            message: "Unable to capture recording from the camera.",
        });
    }
}

module.exports ={
    getAllRecordings,
    getRecordingById,
    captureRecording,
};