const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const videosFolder = path.join(__dirname, "..", "videos");

function createRecordingFilename() {
    const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-");

    return `tapo-${timestamp}.mp4`;
}

function captureRecording(duration = 15) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(videosFolder)) {
            fs.mkdirSync(videosFolder, { recursive: true });
        }

        const {
            TAPO_USERNAME,
            TAPO_PASSWORD,
            TAPO_IP,
            TAPO_STREAM = "stream2",
        } = process.env;

        if (!TAPO_USERNAME || !TAPO_PASSWORD || !TAPO_IP) {
            reject(
                new Error(
                    "Tapo camera configuration is missing from the environment variables."
                )
            );
            return;
        }

        const filename = createRecordingFilename();
        const outputPath = path.join(videosFolder, filename);

        const rstpUrl =
            `rtsp://${encodeURIComponent(TAPO_USERNAME)}:` +
            `${encodeURIComponent(TAPO_PASSWORD)}@` +
            `${TAPO_IP}:554/${TAPO_STREAM}`;
        
        const ffmpegArguments = [
            "-rtsp_transport",
            "tcp",
            "-i",
            rstpUrl,
            "-t",
            String(duration),
            "-map",
            "0:v:0",
            "-map",
            "0:v:0",
            "-c:v",
            "copy",
            "-c:a",
            "aac"
            "-b:a"
            "64k",
            "-movflags",
            "+faststart",
            "-y",
            outputPath,
        ];

        console.log(`[Capture] Starting ${duration}-second recording...`);

        const ffmpeg = spawn("ffmpeg", ffmpegArguments, {
            windowsHide: true,
        });

        let errorOutput = "";

        ffmpeg.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });

        ffmpeg.on("error", (error) => {
            reject(
                new Error(`FFmpeg could not be started: ${error.message}`)
            );
        });

        ffmpeg.on("close", (exitCode) => {
            if (exitCode !== 0) {
                if(fs.existsSync(outputPath)) {
                    fs.unlinkSync(outputPath);
                }

                reject(
                    new Error(
                        `FFmpeg exited with code ${exitCode}. ${errorOutput}`
                    )
                );
                return;
            }

            console.log(`[Capture] Recording saved: ${filename}`);

            resolve({
                filename,
                outputPath,
                videoUrl: `http://localhost:5000?videos/${filename}`,
            });
        });
    });
}

module.exports = {
    captureRecording,
};