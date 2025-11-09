import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './index.css'
import ServerHealthCheck from './serverHealthCheck'

function App() {
  const [count, setCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen(!menuOpen)

  const switchStyle = (style, tone) => {
    document.body.className = `${style} ${tone}`
  }

  const newLocal = "button btn btn-primary"
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Header */}
      <div className="container">
        <header className="app-header morph-header">
          

          <nav className="desktop-nav radio-inputs">
            <button className="btn-primary" onClick={() => switchStyle('glass', 'tone-soft')}>Glass</button>
            <button className="btn-primary" onClick={() => switchStyle('neumo', 'tone-light')}>Neumo</button>
            <button className="btn-primary" onClick={() => switchStyle('clay', 'tone-vivid')}>Clay</button>
            <button className="btn-primary" onClick={() => switchStyle('dark', 'tone-dark')}>Dark</button>

          </nav>
          <div className="logo-title">
              <img src={viteLogo} alt="Vite" className="logo small" />
              <h1>Morphism UI</h1>
            </div>
            
          <button className="btn hide-on-large-screen" onClick={toggleMenu}>
            ☰
          </button>
        </header>
      </div>

      {/* Mobile Sidebar */}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleMenu}>×</button>
        <nav>
          <a className="button btn-primary" onClick={() => switchStyle('glass', 'tone-soft')}>Glass</a>
          <a className="button btn-primary" onClick={() => switchStyle('neumo', 'tone-light')}>Neumo</a>
          <a className="button btn-primary" onClick={() => switchStyle('clay', 'tone-vivid')}>Clay</a>
          <a className="button btn-primary" onClick={() => switchStyle('', 'tone-dark')}>Dark</a>
        </nav>
        
      </aside>
      {/* Main Content */}
      <main className="main-content">
        <div className="grid-container">
          <div className="card">
            <h2 >Kubernetes Todo App</h2>
            {/* Replace this with your actual component */}
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
            <button className= {newLocal} onClick={() => setCount(count + 1)}>
              count is {count}
            </button>
            <p>
              Edit <code>src/App.jsx</code> and save to test HMR
            </p>
          </div>

        </div>
          <div className="grid-container">
            <ServerHealthCheck />
          </div>
      </main>

      {/* Footer */}
      <footer className="app-footer morph-footer text-center">
        <p>© 2025 Morphism UI • Built with ❤️ using Vite + React</p>
      </footer>
    </div>
  )
}

export default App
