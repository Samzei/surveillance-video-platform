function App() {
  return (
    <div className="app">
      <header className="top-nav">
        <div className="logo">SecureView</div>
        <nav>
          <a href="#">Home</a>
          <a href="#">Recording</a>
          <a href="#">Settings</a>
          <a href="#">Profile</a>
        </nav>
      </header>

      <main className="dashboard">
        <section className="search-section">
          <input type="text" name="Search-bar" placeholder="Search by date or time..." />
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
              <option>Camera 1</option>
              <option>Camera 2</option>
            </select>

            <button>Apply Filter</button>
          </aside>
          <section>
            <h2>Recent Recordings</h2>
            <div className="video-grid">
              {[1, 2, 3, 4, 5, 6].map((clip) => (
                  <div className="clip-card" key={clip}>
                    <div className="thumbnail">Thumbnail</div>
                    <p>Camera {clip}</p>
                    <p>12/03/2026 14:{clip}2</p>
                  </div>
              ))}
           </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;