import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function VideoPlayer() {
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5000/api/recordings/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Recording not found");
        }
        
        return response.json();
      })
      .then((data) => {
        setClip(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");

  const [clip, setClip] = useState(null);
  const [loading, setLoading] = useState(true);
  
  if (loading) {
    return <h2>Loading recording...</h2>;
  }

  if (!clip) {
    return (
      <main className="player-container">
        <h1>Recording not found</h1>
        <Link to="/">Back to Dashboard</Link>
      </main>
    );
  }

  function getActionTags(actions) {
    if (!actions) return [];
    
    return actions.split(",").map((action) => action.trim());
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
          {clip.actions && (
            <div>
              <p>Actions:</p>
              <div className="tag-list">
                {getActionTags(clip.actions).map((action) => (
                  <span className="action-badge" key={action}>
                    {action}
                  </span>
                ))}
              </div>
            </div>
          )}
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
              <button
                onClick={() => {
                  const generatedLink = 
                    window.location.origin + `/video/${clip.id}`;

                  setShareLink(generatedLink);
                }}
              >
                Generated Link  
              </button>
              <button>Confirm Share</button>
              <button onClick={() => setShowShareModal(false)}>Cancel</button>

              {shareLink && (
                <div className="generated-link">
                  <p>Generated Link:</p>

                  <input 
                    type="text"
                    value={shareLink}
                    readOnly
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareLink);
                      alert("Link copied!");
                    }}
                  >
                    Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;