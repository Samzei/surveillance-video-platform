import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { recordings } from "../data/recordings";

function VideoPlayer() {
  const { id } = useParams();
  const [showShareModal, setShowShareModal] = useState(false);
  console.log("URL id", id);
  console.log("Recordings:", recordings);

  const clip = recordings.find((recording) => String(recording.id) === id);

  if (!clip) {
    return (
      <main className="player-container">
        <h1>Recording not found</h1>
        <Link to="/">Back to Dashboard</Link>
      </main>
    );
  }

  return (
    <div className="video-page">
      <header className="top-nav">
        <div className="logo">SecureView</div>
      </header>

      <main className="player-container">
        <Link to="/" className="back-link">
          ← Back to Dashboard
        </Link>

        <div className="video-player">
          <video controls className="actual-video">
            <source src={clip.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="video-info">
          <p>Date: {clip.date}</p>
          <p>Time: {clip.time}</p>
          <p>Camera: {clip.camera}</p>
          <p>Description: {clip.description}</p>
        </div>

        <div className="player-actions">
          <button>Play</button>
          <button>Pause</button>
          <a 
            href={clip.videoUrl}
            download
            className="download-button"
          >
            Download
          </a>
          <button onClick={() => setShowShareModal(true)}>Share</button>
        </div>
      </main>

      {showShareModal && (
        <div className="modal-overlay">
          <div className="share-modal">
            <h2>Share Video</h2>

            <p>
              Selected clip: {clip.camera} — {clip.date} {clip.time}
            </p>

            <label>Access Type</label>
            <select>
              <option>Private link</option>
              <option>Download only</option>
            </select>

            <label>Link Expiry</label>
            <select>
              <option>24 hours</option>
              <option>7 days</option>
              <option>30 days</option>
            </select>

            <div className="modal-actions">
              <button>Generate Link</button>
              <button>Confirm Share</button>
              <button onClick={() => setShowShareModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;