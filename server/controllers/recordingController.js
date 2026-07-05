const recordingService = require("../services/recordingService");

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

module.exports ={
    getAllRecordings,
    getRecordingById,
};