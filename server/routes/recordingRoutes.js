const express = require("express");
const recordingController = require("../controllers/recordingController");

const router = express.Router();

router.get("/", recordingController.getAllRecordings);
router.post("/capture", recordingController.captureRecording);
router.get("/:id", recordingController.getRecordingById);

module.exports = router;