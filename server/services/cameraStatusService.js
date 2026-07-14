const { spawn } = require("child_process");

function buildRtspUrl() {
    const {
        TAPO_USERNAME,
        TAPO_PASSWORD,
        TAPO_IP,
        TAPO_STREAM = "stream2",
    } = process.env;

    if (!TAPO_USERNAME || !TAPO_PASSWORD || !TAPO_IP) {
        throw new Error("Tapo camera configuration is incomplete.");
    }

    return (
        `rtsp://${encodeURIComponent(TAPO_USERNAME)}:` +
        `${encodeURIComponent(TAPO_PASSWORD)}@` +
        `${TAPO_IP}:554/${TAPO_STREAM}`
    );
}

function checkCameraStatus() {
    return new Promise((resolve) =>{
        let rtspUrl;
        
        try {
            rtspUrl = buildRtspUrl();
        } catch (error) {
            resolve({
                connected: false,
                status: "Configuration missing",
                message: error.message,
            });

            return;
        }

        const args =[
            "-v",
            "error",
            "-rtsp_transport",
            "tcp",
            "-show_entries",
            "stream=codec_type,codec_name,width,height",
            "-of",
            "json",
            rtspUrl,
        ];

        const ffprobeCommand = process.env.FFPROBE_PATH || "C:\\ffmpeg\\bin\\ffprobe.exe";

        console.log({
            ffprobeCommand,
            usernameLoaded: Boolean(process.env.TAPO_USERNAME),
            passwordLoaded: Boolean(process.env.TAPO_PASSWORD),
            ipLoaded: Boolean(process.env.TAPO_IP),
            stream: process.env.TAPO_STREAM,
        });

        const ffprobe = spawn(ffprobeCommand, args, {
            windowsHide: true,
        });

        let output = "";
        let errorOutput = "";
        let finished = false;

        const timeout = setTimeout(() => {
            if (!finished) {
                ffprobe.kill();

                resolve({
                    connected: false,
                    status: "Offline",
                    message: "Camera connection timed out.",
                });
            }
        }, 8000);

        ffprobe.stdout.on("data", (data) => {
            output += data.toString();
        });

        ffprobe.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });

        ffprobe.on("error", (error) => {
            if (finished) return;

            finished = true;
            clearTimeout(timeout);

            resolve({
                connected: false,
                status: "Unavailable",
                message: 
                    error.code === "ENOENT"
                        ? "FFprobe executable could not be found."
                        : error.message,
            });
        });

        ffprobe.on("close", (code) => {
            if (finished) return;

            finished = true;
            clearTimeout(timeout);

            if (code !== 0) {
                resolve({
                    connected: false,
                    status: "Offline",
                    message: 
                        errorOutput.trim() ||
                        `FFprobe exited with code ${code}.`,
                });

                return;
            }

            try {
                const result = JSON.parse(output);

                const videoStream = result.streams?.find(
                    (stream) => stream.codec_type === "video"
                );

                resolve({
                    connected: true,
                    status: "Online",
                    camera: "Tapo C110",
                    stream: process.env.TAPO_STREAM || "stream2",
                    codec: videoStream?.codec_name || "Unknown",
                    resolution:
                        videoStream?.width && videoStream?.height
                            ? `${videoStream.width} x ${videoStream.height}`
                            : "Unknown",
                    checkedAt: new Date().toISOString(),
                });
            } catch (error) {
                resolve({
                    connected: false,
                    status: "Unknown",
                    message: "Camera replied, but its status could not be read.",
                });
            }
        });
    });
}

module.exports = {
    checkCameraStatus,
};