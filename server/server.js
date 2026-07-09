const express = require("express");
const cors = require("cors");

const recordingRoutes = require("./routes/recordingRoutes");
const initDb = require("./database/initDb");
const { scanVideosFolder } = require("./services/recordingScanner");

const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/videos", express.static(path.join(__dirname, "videos")));

app.use("/api/recordings", recordingRoutes);

const PORT = 5000;

initDb().then(async () => {
    await scanVideosFolder();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});