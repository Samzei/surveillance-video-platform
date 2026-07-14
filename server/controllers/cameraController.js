const cameraStatusService = require("../services/cameraStatusService");

async function getCameraStatus(req, res) {
    try {
        const status = await cameraStatusService.checkCameraStatus();

        res.json(status);
    } catch (error) {
        console.error("Camera status check failed:", error);

        res.status(500).json({
            connected: false,
            status: "Error",
            message: "Unable to check camera status.",
        });
        
    }
}

module.exports = {
    getCameraStatus,
};
