const chokidar = require("chokidar");
const path = require("path");
const { addRecordingIfMissing } = require("./recordingScanner");

const videosFolder = path.join(__dirname, "..", "videos");

function startFileWatcher() {
    const watcher = chokidar.watch(videosFolder, {
        ignored: /(^|[\/\\])\../,
        persitent: true,
        ignoreInitial: true,

        awaitWriteFinish: {
            stabilityThreshold: 2000,
            pollInterval: 200,
        },
    });

    watcher.on("add", async (filepath) => {
        const filename = path.basename(filepath);

        if (!filename.toLowerCase().endsWith(".mp4")) {
            return;
        }

        console.log(`[Watcher] New video detected: ${filename}`);

        try {
            await addRecordingIfMissing(filename);
            console.log(`[Watcher] Database updated for: ${filename}`);
        } catch (error){
            console.error(`[Watcher] Failed to process ${filename}:`, error);
            
        }
    });

    console.log("[Watcher] Watching videos folder for new recoedings...");
}

module.exports = startFileWatcher;