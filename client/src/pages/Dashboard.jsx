import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard({ logoutUser }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCamera, setSelectedCamera] = useState("All Cameras");
    const [selectedDate, setSelectedDate] = useState("");
    const [recordings, setRecordings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
    }, []);
        
    const filteredRecordings = recordings.filter((clip) => {
        const matchesSearch =
            clip.camera.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clip.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clip.date.includes(searchTerm) ||
            clip.time.includes(searchTerm) ||
            (clip.actions && clip.actions.toLowerCase().includes(search));

        const matchesCamera =
            selectedCamera === "All Cameras" || clip.camera === selectedCamera;
            
        const matchesDate =
            selectedDate === "" || clip.date.split("/").reverse().join("-") === selectedDate;
        
        return matchesSearch && matchesCamera && matchesDate;
    })

    if (loading) {
        return <p>Loading recordings ...</p>
    }
    return (
        <div className="app">
            <header className="top-nav">
                <div className="logo">SecureView</div>
                <nav>
                    <a href="#">Home</a>
                    <a href="#">Recordings</a>
                    <a href="#">Settings</a>
                    <a href="#">Profile</a>
                    <button 
                        className="logout-button"
                        onClick={logoutUser}
                    >
                        Logout
                    </button>
                </nav>
            </header>

            <main className="dashboard">
                <section className="search-section">
                    <input 
                        type="text" 
                        placeholder="Search by date, time or description..." 
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </section>

                <section className="content">
                    <aside className="filters">
                        <h2>Filters</h2>

                        <label>Date</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(event) => setSelectedDate(event.target.value)}
                        />
                        
                        <label>Camera</label>
                        <select
                            value={selectedCamera}
                            onChange={(event) => setSelectedCamera(event.target.value)}
                        >
                            <option>All Cameras</option>
                            <option>Front door Camera</option>
                            <option>Driveway Camera</option>
                            <option>Garden Camera</option>
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
                        <h2>Recent Recordings</h2>

                        {filteredRecordings.length === 0 ?(
                            <p>No recordings found.</p>
                        ) : (
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
                                        <p className="action-tags">Actions: {clip.actions}</p>
                                    )}
                                </Link>
                            ))}
                        </div>
                        )}
                        
                    </section>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;