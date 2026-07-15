const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const videosFolder = path.join(__dirname, "..", "videos");
const thumbnailsFolder = path.join(__dirname, "..", "thumbnails");

function createThumbnail(filename) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(thumbnailsFolder)) {
      fs.mkdirSync(thumbnailsFolder, { recursive: true });
    }

    const videoPath = path.join(videosFolder, filename);

    const baseName = path.parse(filename).name;
    const thumbnailFilename = `${baseName}.jpg`;
    const thumbnailPath = path.join(
      thumbnailsFolder,
      thumbnailFilename
    );

    // Do not regenerate an existing thumbnail.
    if (fs.existsSync(thumbnailPath)) {
      resolve({
        thumbnailFilename,
        thumbnailUrl:
          `http://localhost:5000/thumbnails/${thumbnailFilename}`,
      });
      return;
    }

    const ffmpegCommand =
      process.env.FFMPEG_PATH || "ffmpeg";

    const argumentsList = [
      "-ss",
      "00:00:01",
      "-i",
      videoPath,
      "-frames:v",
      "1",
      "-q:v",
      "2",
      "-y",
      thumbnailPath,
    ];

    const ffmpeg = spawn(ffmpegCommand, argumentsList, {
      windowsHide: true,
    });

    let errorOutput = "";

    ffmpeg.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    ffmpeg.on("error", (error) => {
      reject(
        new Error(
          `Thumbnail FFmpeg process could not start: ${error.message}`
        )
      );
    });

    ffmpeg.on("close", (exitCode) => {
      if (exitCode !== 0) {
        reject(
          new Error(
            `Thumbnail generation failed with code ${exitCode}. ${errorOutput}`
          )
        );
        return;
      }

      console.log(
        `[Thumbnail] Created: ${thumbnailFilename}`
      );

      resolve({
        thumbnailFilename,
        thumbnailUrl:
          `http://localhost:5000/thumbnails/${thumbnailFilename}`,
      });
    });
  });
}

module.exports = {
  createThumbnail,
};