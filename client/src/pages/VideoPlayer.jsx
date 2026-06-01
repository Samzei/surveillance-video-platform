function VideoPlayer() {
  return (
    <div className="video-player">
        <header className="top-nav">
            <div className="logo">SecureView</div>
        </header>

        <main className="player-container">
            <back-button>Back</back-button>
            <div className="video-player">Video Player</div>
            <div className="video-info">
                <p>Date: 12/03/2026</p>
                <p>Time: 14: 32</p>
                <p>Camera: Camera 1</p>
            </div>

            <div className="player-actions">
                <button>Play </button>
                <button>Pause </button>
                <button>Download </button>
                <button>Share </button>
            </div>
        </main>
    </div>
  );
}

export default VideoPlayer;