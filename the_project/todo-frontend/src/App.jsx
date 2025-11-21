import { useEffect, useState, useCallback } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "./index.css";
import ServerHealthCheck from "./serverHealthCheck";
import { CONFIG } from "./config";

function App() {
  const [count, setCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Environment:", CONFIG.env);
    console.log("API URL:", CONFIG.apiUrl);
    console.log("Version:", CONFIG.appVersion);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const url = `api/${CONFIG.apiVersion}`;
    try {
      const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch:", error);
      setData({ error: error.message });
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);
  const switchStyle = useCallback((style, tone) => {
    document.body.className = `${style} ${tone}`;
  }, []);

  const styles = [
    { label: "Glass", style: "glass", tone: "tone-soft" },
    { label: "Neumo", style: "neumo", tone: "tone-light" },
    { label: "Clay", style: "clay", tone: "tone-vivid" },
    { label: "Dark", style: "dark", tone: "tone-dark" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Header */}
      <header className="app-header morph-header container">
        <nav className="desktop-nav radio-inputs">
          {styles.map(({ label, style, tone }) => (
            <button
              key={label}
              className="btn-primary"
              onClick={() => switchStyle(style, tone)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="logo-title">
          <img src={viteLogo} alt="Vite" className="logo small" />
          <h1>Morphism UI</h1>
        </div>

        <button
          className="btn-primary hide-on-large-screen"
          onClick={toggleMenu}
        >
          ☰
        </button>
      </header>

      {/* Mobile Sidebar */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleMenu}>
          ×
        </button>
        <nav>
          {styles.map(({ label, style, tone }) => (
            <a
              key={label}
              className="button btn-primary"
              onClick={() => switchStyle(style, tone)}
            >
              {label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="grid grid-auto-fit">
          <div className="card">
            <h2>Kubernetes Todo App</h2>
            <p>TodoListView() goes here</p>
          </div>

          <div className="card">
            <h3>Vite + React</h3>
            <div className="logos">
              <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
              </a>
              <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setCount((c) => c + 1)}
            >
              count is {count}
            </button>

            <p>
              Edit <code>src/App.jsx</code> and save to test HMR
            </p>
          </div>

          <div className="card">
            <h1>API Demo</h1>
            <div className="info">
              {Object.entries({
                Environment: CONFIG.env,
                "App Version": CONFIG.appVersion,
                "API Version": CONFIG.apiVersion,
                "API Base": CONFIG.apiBaseUrl,
                "API URL": CONFIG.apiUrl,
              }).map(([key, value]) => (
                <p key={key}>
                  {key}: {value}
                </p>
              ))}
            </div>

            <button
              className="btn btn-primary"
              onClick={fetchData}
              disabled={loading}
            >
              {loading ? "Loading..." : "Fetch Data"}
            </button>

            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
          </div>
        </div>

        <div className="container">
          <ServerHealthCheck />
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer morph-footer text-center">
        <p>© 2025 Morphism UI • Built with ❤️ using Vite + React</p>
      </footer>
    </div>
  );
}

export default App;
