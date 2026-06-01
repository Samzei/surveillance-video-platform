import { Link } from "react-router-dom";

function Dashboard() {
    const clips = [1, 2, 3, 4, 5, 6];

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
                            <option value="">Camera 1</option>
                            <option value="">Camera 2</option>
                        </select>

                        <button>Apply Filters</button>
                    </aside>

                    <section className="recordings">
                        <h2>Recent Recordings</h2>
                        <div className="video-grid">
                            {clips.map((clip) => (
                                <Link to="/video" className="clip-card" key={clip}>
                                    <div className="thumbnail">Thumbnail</div>
                                    <p>Camera {clip}</p>
                                    <p>12/03/2026 14:{clip}2</p>
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