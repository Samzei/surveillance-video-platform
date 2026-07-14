const express = require("express");
const cameraController = require("../controllers/cameraController");

const router = express.Router();

router.get("/status", cameraController.getCameraStatus);

module.exports = router;