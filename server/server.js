const express = require("express");
const cors = require("cors");

const recordings = require("./data/recordings.json");

const app = express();

app.use(cors());

app.get("/api/recordings", (req, res) => {
    res.json(recordings);
})

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});