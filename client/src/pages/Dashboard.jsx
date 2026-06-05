import { Link } from "react-router-dom";
import { recordings } from "../data/recordings";

function Dashboard() {
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
                    <input type="text" placeholder="Search by date or time ..." />
                </section>

                <section className="content">
                    <aside className="filters">
                        <h2>Filters</h2>

                        <label>Date</label>
                        <input type="date" />

                        <label>From</label>
                        <input type="time" />
                        
                        <label>To</label>
                        <input type="time" />
                        
                        <label>Camera</label>
                        <select>
                            <option>All Cameras</option>
                            <option>Front door Camera</option>
                            <option>Driveway Camera</option>
                            <option>Garden Camera</option>
                        </select>

                        <button>Apply Filters</button>
                    </aside>

                    <section className="recordings">
                        <h2>Recent Recordings</h2>
                        <div className="video-grid">
                            {recordings.map((clip) => (
                                <Link to={'/video/${clip.id}'} className="clip-card" key={clip.id}>
                                    <div className="thumbnail">Thumbnail</div>
                                    <p>{clip.camera}</p>
                                    <p>
                                        {clip.date} {clip.time}
                                    </p>
                                    <p>{clip.description}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;