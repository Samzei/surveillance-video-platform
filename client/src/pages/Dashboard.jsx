import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccessibilityControls from "../components/AccessibilityControls";

function Dashboard({ logoutUser }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCamera, setSelectedCamera] = useState("All Cameras");
    const [selectedDate, setSelectedDate] = useState("");
    const [recordings, setRecordings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCapturing, setIsCaptureMessage] = useState(false);
    const [captureMessage, setCaptureMessage] = useState("");

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
            setCaptureMessage("Recording from Tapo C110...");

            const response = await fetch(
                "http://localhost:5000/api/recordings/capture",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    boddy: JSON.stringify({
                        duration: 15,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Camera recording failed."
                );
            }

            setCaptureMessage(
                "Recording completed: It will appear shortly."
            );
        } catch (error) {
            console.error("Capture error:", error);
            setCaptureMessage(error.message);
        } finally {
            setIsCapturing(false);
        }
    }

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
                <AccessibilityControls />
                <section className="Capture-panel">
                    <div>
                        <h2>Camera Capture</h2>
                        <p>Record a 15-second clip from the Tapo C110.</p>
                    </div>

                    <button
                        type="button"
                        onClick={handleCapture}
                        disabled={isCapturing}
                    >
                        {isCapturing
                            ? "Recording..."
                            : "Recording 15 seconds"}
                    </button>

                    {captureMessage && (
                        <p role="status">{CaptureMessage}</p>
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
            </main>
        </div>
    );
}

export default Dashboard;