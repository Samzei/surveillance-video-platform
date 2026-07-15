const fs = require("fs");
const path = require("path");
const openDb = require("../database/db");

const videosFolder = path.join(__dirname, "..", "videos");

const { createThumbnail } = require("./thumbnailService");

async function addRecordingIfMissing(file) {
  const db = await openDb();

  let recording = await db.get(
    "SELECT * FROM recordings WHERE filename = ?",
    file
  );

  let thumbnailUrl = recording?.thumbnailUrl;

  try {
    const thumbnail = await createThumbnail(file);
    thumbnailUrl = thumbnail.thumbnailUrl;
  } catch (error) {
    console.error(
      `[Thumbnail] Could not process ${file}:`,
      error.message
    );
  }

  if (recording) {
    if (!recording.thumbnailUrl && thumbnailUrl) {
      await db.run(
        `
        UPDATE recordings
        SET thumbnailUrl = ?
        WHERE filename = ?
        `,
        thumbnailUrl,
        file
      );
    }

    return;
  }

  const now = new Date();

  const date = now.toLocaleDateString("en-GB");

  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  await db.run(
    `
    INSERT INTO recordings (
      filename,
      camera,
      date,
      time,
      description,
      videoUrl,
      actions,
      thumbnailUrl
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    file,
    "Tapo C110",
    date,
    time,
    `Automatically discovered recording: ${file}`,
    `http://localhost:5000/videos/${file}`,
    "auto discovered, surveillance recording",
    thumbnailUrl || null
  );

  console.log(`New recording added: ${file}`);
}

async function scanVideosFolder() {

    if (!fs.existsSync(videosFolder)) {
        fs.mkdirSync(videosFolder);
    }

    const files = fs 
    .readdirSync(videosFolder)
    .filter((file) => file.toLowerCase().endsWith(".mp4"));

    for (const file of files) {
        await addRecordingIfMissing(file);
    }
}

module.exports = {
    scanVideosFolder,
    addRecordingIfMissing,
};