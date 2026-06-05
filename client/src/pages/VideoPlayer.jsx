import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { recordings } from "../data/recordings";


function VideoPlayer() {
    const { id } = useParams();
    const [showShareModal, setShowShareModal] = useState(false);

    const clip = recordings.find((recording) => recording.id === id);

    if (!clip) {
        return (
            <main className="player-container">
                <h1>Recording not found</h1>
                <Link to="/">Back to Dashbord</Link>
            </main>
        );
    }

  return (
    <div className="video-player">
        <header className="top-nav">
            <div className="logo">SecureView</div>
        </header>

        <main className="player-container">
            <Link className="back-link">
                ← Back to Dashboard
            </Link>

            <div className="video-player">Video Player Placholder</div>

            <div className="video-info">
                <p>Date: {clip.date}</p>
                <p>Time: {clip.time}</p>
                <p>Camera: {clip.camera}</p>
                <p>Description: {clip.description}</p>
            </div>

            <div className="player-actions">
                <button>Play </button>
                <button>Pause </button>
                <button>Download </button>
                <button onClick={() => setShowShareModal(true)}>Share </button>
            </div>
        </main>

        {showShareModal && (
            <div className="modal-overlay">
                <div className="share-modal">
                    <h2>Share Video</h2>

                    <p>
                        Selected clip: {clip.camera} - {clip.date} {clip.time}
                    </p>

                    <label>Access Type</label>
                    <select>
                        <option>Private Link</option>
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