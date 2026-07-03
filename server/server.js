const express = require("express");
const cors = require("cors");

const recordings = require("./data/recordings.json");

const app = express();

app.use(cors());

app.get("/api/recordings", (req, res) => {
    const {id} = req.params;

    const recording = recordings.find(
        (recording) => recording.id === id
    );

    if (!recording) {
        return res.status(404).json({
            message: "Recording not found"
        });
    }

    res.json(recordings);
})

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});