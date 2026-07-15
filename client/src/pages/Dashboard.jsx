import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccessibilityControls from "../components/AccessibilityControls";

function Dashboard({ logoutUser }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCamera, setSelectedCamera] = useState("All Cameras");
    const [selectedDate, setSelectedDate] = useState("");
    const [recordings, setRecordings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [captureDuration, setCaptureDuration] = useState(15);
    const [isCapturing, setIsCapturing] = useState(false);
    const [captureMessage, setCaptureMessage] = useState("");
    const [secondsRemaining, setSecondsRemaining] = useState(0);
    const [cameraStatus, setCameraStatus] = useState(null);
    const [cameraStatusLoading, setCameraStatusLoading] = useState(true);

    useEffect(() => {
        function fetchRecordings() {
            fetch("http://localhost:5000/api/recordings")
                .then((response) => response.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setRecordings(data);
                    } else {
                        console.error("Expected an array but got:", data);
                        setRecordings([]);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching recordings:", error);
                    setLoading(false);
                });
        }
        fetchRecordings();
        
        const interval = setInterval(fetchRecordings, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        async function fetchCameraStatus() {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/camera/status"
                );

                const data = await response.json();

                setCameraStatus(data);
            } catch (error) {
                console.error("Camera status request failed;", error);

                setCameraStatus({
                    connected: false,
                    status: "Unavailable",
                    message: "Could not contact the backend.",
                });
                
            } finally {
                setCameraStatusLoading(false);
            }
        }

        fetchCameraStatus();

        const interval = setInterval(fetchCameraStatus, 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!isCapturing || secondsRemaining <= 0) {
            return;
        }

        const timer = setTimeout(() => {
            setSecondsRemaining((currentSeconds) =>
                Math.max(currentSeconds - 1, 0)
            );
        }, 1000);

        return () => clearTimeout(timer);
    }, [isCapturing, secondsRemaining]);
        
    const filteredRecordings = recordings.filter((clip) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            clip.camera.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clip.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clip.date.includes(searchTerm) ||
            clip.time.includes(searchTerm) ||
            (clip.actions && clip.actions.toLowerCase().includes(search));

        const matchesCamera =
            selectedCamera === "All Cameras" || 
            clip.camera === selectedCamera;
            
        const matchesDate =
            selectedDate === "" || 
            clip.date.split("/").reverse().join("-") === selectedDate;
        
        return matchesSearch && matchesCamera && matchesDate;
    })

    const resultMessage = 
        filteredRecordings.length === 1
            ? "1 recording found"
            : `${filteredRecordings.length} recordings found`;

    if (loading) {
        return <p>Loading recordings ...</p>
    }

    function getActionTags(actions) {
        if (!actions) return [];

        return actions.split(",").map((action) => action.trim());
    }

    const totalRecordings = recordings.length;
    
    const totalCameras = new Set(recordings.map((clip) => clip.camera)).size;

    const totalTaggedEvents = recordings.reduce((total, clip) => {
        if (!clip.actions) return total;

        return total + clip.actions.split(",").length;
    }, 0);

    const latestRecording = recordings[0];

    async function handleCapture() {
        try {
            setIsCapturing(true);
            setSecondsRemaining(captureDuration);
            setCaptureMessage("Recording from Tapo C110...");

            const response = await fetch(
                "http://localhost:5000/api/recordings/capture",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    boddy: JSON.stringify({
                        duration: captureDuration,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Camera recording failed."
                );
            }

            setSecondsRemaining(0);
            

            setCaptureMessage(
                "Recording completed successfully. It will appear on the dashboard shortly."
            );
        } catch (error) {
            console.error("Capture error:", error);

            setSecondsRemaining(0);
            setCaptureMessage(
                error.message || "Unable to record from the camera."
            );
        } finally {
            setIsCapturing(false);
        }
    }

    const captureProgress = 
        isCapturing && captureDuration > 0
            ? ((captureDuration - secondsRemaining) /
                captureDuration) *
                100
            : 0;

    return (
        <div className="app">
            <a href="#main-content" className="skip-link">
                Skip to main content
            </a>
            <header className="top-nav">
                <div className="logo">SecureView</div>
                <nav aria-label="Main navigation">
                    <Link to="/" aria-current="page">
                        Home
                    </Link>

                    <a href="#recordings-heading">
                        Recordings
                    </a>

                    <button
                        type="button"
                        className="logout-button"
                        onClick={logoutUser}
                    >
                        Logout
                    </button>
                </nav>
            </header>

            <main id="main-content" className="dashboard">
                <div className="dashboard-container">
                    <section className="stats-grid">
                        <div className="stat-card">
                            <h3>Total Recordings</h3>
                            <p>{totalRecordings}</p>
                        </div>

                        <div className="stat-card">
                            <h3>Cameras</h3>
                            <p>{totalCameras}</p>
                        </div>

                        <div className="stat-card">
                            <h3>Tagged Event</h3>
                            <p>{totalTaggedEvents}</p>
                        </div>

                        <div className="stat-card">
                            <h3>Latest Recording</h3>
                            <p>
                                {latestRecording
                                    ?`${latestRecording.date} ${latestRecording.time}`
                                    : "N/A"}
                            </p>
                        </div>
                    </section>
                    <section
                        className="camera-status-panel"
                        aria-labelledby="camera-status-heading"
                        >
                        <div className="camera-status-header">
                        <h2 id="camera-status-heading">Camera Status</h2>

                        <span
                            className={`status-indicator ${
                            cameraStatus?.connected ? "online" : "offline"
                            }`}
                        > 
                            {cameraStatus?.connected ? "Online" : "Offline"}
                        </span>
                        </div>

                        {cameraStatusLoading ? (
                        <p role="status">Checking camera connection...</p>
                        ) : (
                        <>
                            <p>
                            <strong>Camera:</strong>{" "}
                            {cameraStatus?.camera || "Tapo C110"}
                            </p>

                            <p>
                            <strong>Status:</strong>{" "}
                            {cameraStatus?.status || "Unknown"}
                            </p>

                            {cameraStatus?.connected && (
                            <>
                                <p>
                                <strong>Stream:</strong> {cameraStatus.stream}
                                </p>

                                <p>
                                <strong>Resolution:</strong>{" "}
                                {cameraStatus.resolution}
                                </p>

                                <p>
                                <strong>Video codec:</strong>{" "}
                                {cameraStatus.codec}
                                </p>
                            </>
                            )}

                            {!cameraStatus?.connected && cameraStatus?.message && (
                            <p role="alert">{cameraStatus.message}</p>
                            )}

                            <p className="sr-only" aria-live="polite">
                            Camera is {cameraStatus?.connected ? "online" : "offline"}.
                            </p>
                        </>
                        )}
                        </section>
                    <AccessibilityControls />
                    <section 
                        className="Capture-panel"
                        aria-labelledby="capture-heading"
                    >
                        
                        <h2 id="capture-heading">Camera Capture</h2>
                        <p>
                            Create a new recording from the Tapo C110 camera.
                        </p>

                        <label htmlFor="capture-duration">
                            Recording duration
                        </label>

                        <select
                            id="capture-duration"
                            value={captureDuration}
                            onChange={(event) =>
                                setCaptureDuration(Number(event.target.value))
                            }
                            disabled={isCapturing}
                        >
                            <option value={5}>5 seconds</option>
                            <option value={15}>15 seconds</option>
                            <option value={30}>30 seconds</option>
                            <option value={60}>60 seconds</option>
                        </select>
                    
                        <button
                            type="button"
                            onClick={handleCapture}
                            disabled={
                                isCapturing || cameraStatus?.connected === false
                            }
                        >
                            {isCapturing
                                ? "Recording in progress..."
                                : "Start Recording"}
                        </button>

                        {cameraStatus?.connected === false && (
                            <p role="alert">
                                The camera must br online before a recording can begin
                            </p>
                        )}

                        {isCapturing && (
                            <div className="capture-progress">
                                <div className="progress-details">
                                    <span>Recording</span>

                                    <span>
                                        {secondsRemaining}{" "}
                                        {secondsRemaining === 1 ? "second" : "seconds"}{" "}
                                        remaining
                                    </span>
                                </div>

                                <div
                                    className="progress-track"
                                    role="progressbar"
                                    aria-label="Camera recording progress"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    aria-valuenow={Math.round(captureProgress)}
                                >
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${captureProgress}%`
                                        }}
                                    />

                                </div>
                            </div>
                        )}

                        {captureMessage && (
                            <p role="status" aria-live="polite">
                                {captureMessage}
                            </p>
                        )}
                    </section>
                    <section className="search-section">
                        <label htmlFor="recording-search">
                            Search Recordings
                        </label>

                        <input
                            id="recording-search" 
                            type="search" 
                            placeholder="Search by camera, date, time, description or action" 
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </section>

                    <section className="content">
                        <aside className="filters">
                            <h2>Filters</h2>

                            <label htmlFor="date-filter">Date</label>
                            <input
                                id="date-filter"
                                type="date"
                                value={selectedDate}
                                onChange={(event) => setSelectedDate(event.target.value)}
                            />
                            
                            <label htmlFor="camera-filter">Camera</label>
                            <select
                                id="camera-filter"
                                value={selectedCamera}
                                onChange={(event) => setSelectedCamera(event.target.value)}
                            >
                                <option>All Cameras</option>
                                <option>Front door Camera</option>
                                <option>Driveway Camera</option>
                                <option>Garden Camera</option>
                                <option>Tapo C110</option>
                            </select>

                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCamera("All Cameras");
                                    setSelectedDate("");
                                }}
                            >
                                Clear Filters
                            </button>
                        </aside>

                        <section className="recordings">
                            <h2 id="recordings-heading">Recent Recordings</h2>

                            {filteredRecordings.length === 0 ?(
                                <p>No recordings found.</p>
                            ) : (
                                <>
                                    <p className="sr-only" role="status" aria-live="polite">
                                        {resultMessage}
                                    </p>

                                    <div className="video-grid">
                                    {filteredRecordings.map((clip) => (
                                        
                                        <Link 
                                            to={`/video/${clip.id}`} 
                                            className="clip-card" 
                                            key={clip.id}
                                        >
                                            <div className="thumbnail">Thumbnail</div>
                                            <p>{clip.camera}</p>
                                            <p>
                                                {clip.date} {clip.time}
                                            </p>
                                            <p>{clip.description}</p>

                                            {clip.actions && (
                                                <div className="tag-list">
                                                    {getActionTags(clip.actions).map((action) => (
                                                        <button
                                                            type="button"
                                                            className="action-badge"
                                                            key={action}
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                setSearchTerm(action);
                                                            }}
                                                        >
                                                            {action}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </Link>
                                    ))}
                                </div>    
                            </>
                        )}
                            
                        </section>
                    </section>
                </div>
                
            </main>
        </div>
    );
}

export default Dashboard;