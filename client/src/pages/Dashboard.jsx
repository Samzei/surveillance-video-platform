import { useState } from "react";
import { Link } from "react-router-dom";
import { recordings } from "../data/recordings";

function Dashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCamera, setSelectedCamera] = useState("All Cameras");
    const [selectedDate, setSelectedDate] = useState("");
    
    const filteredRecordings = recordings.filter((cip) => {
        const matchesSearch =
            clip.camera.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clip.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clip.date.includes(searchTerm) ||
            clip.time.includes(searchTerm);

        const matchesCamera =
            selectedCamera === "All Camera" || clip.camera === selectedCamera;
            
        const matchesDate =
            selectedDate === "" || clip.date.split("/").reverse().join("-") === selectedDate;
        
        return matchesSearch && matchesCamera && matchesDate;
    })
    return (
        <div className="app">
            <header className="top-nav">
                <div className="logo">SecureView</div>
                <nav>
                    <a href="#">Home</a>
                    <a href="#">Recordings</a>
                    <a href="#">Settings</a>
                    <a href="#">Profile</a>
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
                        <input 
                            value={selectedCamera}
                            onChange={(event) => setSelectedCamera(event.target.value)}
                        />
                        
                        <label>Camera</label>
                        <select>
                            <option>All Cameras</option>
                            <option>Front door Camera</option>
                            <option>Driveway Camera</option>
                            <option>Garden Camera</option>
                        </select>

                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCamera("All Camera");
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
                                    to={'/video/${clip.id}'} 
                                    className="clip-card" 
                                    key={clip.id}
                                >
                                    <div className="thumbnail">Thumbnail</div>
                                    <p>{clip.camera}</p>
                                    <p>
                                        {clip.date} {clip.time}
                                    </p>
                                    <p>{clip.description}</p>
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