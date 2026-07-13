import { useEffect, useRef, useState } from "react";
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

  const closeModalButtonRef = useRef(null);
  const shareButtonRef = useRef(null);

  useEffect(() => {
    if (!showShareModal) return;

    closeModalButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setShowShareModal(false);
        shareButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showShareModal]);
  
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
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="top-nav">
        <div className="logo">SecureView</div>
      </header>

      <main id="main-content" className="player-container">
        <Link to="/" className="back-link">
          ← Back to Dashboard
        </Link>

        <div className="video-player">
          <video 
            controls
            className="actual-video"
            aria-label={`recording from ${clip.camera} on ${clip.date} at ${clip.time}`}
          >
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
          <button
            ref={shareButtonRef}
            type="button"
            onClick={() => setShowShareModal(true)}
          >
            Share
          </button>
        </div>
      </main>

      {showShareModal && (
        <div className="modal-overlay">
          <div 
            className="share-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-modal-title"
            aria-describedby="share-modal-description"
          >
            <h2 id="share-modal-title">Share Video</h2>

            <p id="share-modal-description">
              Create a controlled share link for this recording.
            </p>
            <p>
              Selected clip: {clip.camera} — {clip.date} {clip.time}
            </p>

            <label htmlFor="access-type">Access Type</label>
            <select id="access-type">
              <option>Private link</option>
              <option>Download only</option>
            </select>

            <label htmlFor="link-expiry">Link Expiry</label>
            <select id="link-expiry">
              <option>24 hours</option>
              <option>7 days</option>
              <option>30 days</option>
            </select>

            <div className="modal-actions">
              <button
                type="button"
                onClick={() => {
                  const generatedLink = 
                    window.location.origin + `/video/${clip.id}`;

                  setShareLink(generatedLink);
                }}
              >
                Generated Link  
              </button>
              <button type="button">Confirm Share</button>
              <button
                ref={closeModalButtonRef}
                type="button" 
                onClick={() =>{ 
                  setShowShareModal(false);
                  shareButtonRef.current?.focus();
                }}
              >
                Cancel
              </button>

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