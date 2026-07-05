const express = require("express");
const cors = require("cors");

const recordingRoutes = require("./routes/recordingRoutes.js");
const initDb = require("./database/initDb.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/recordings", recordingRoutes);

const PORT = 5000;

initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});