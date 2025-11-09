import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "/api/v1.4";

// --- Helper function to recursively render data as a table ---
const renderDataTable = (data) => {
  if (typeof data !== 'object' || data === null) {
    return <span>{String(data)}</span>;
  }

  // Check if it's an array (list of items)
  if (Array.isArray(data)) {
    if (data.length === 0) return <span>[]</span>;
    // For arrays, just list items, often better handled in the main component if structure is known
    return (
      <ul style={{ paddingLeft: '20px', margin: 0 }}>
        {data.map((item) => (
          <li key={item.id}>{renderDataTable(item)}</li>
        ))}
      </ul>
    );
  }

  // Handle object (key-value pairs) and render as a table
  const entries = Object.entries(data);
  if (entries.length === 0) return <span>{"{}"}</span>;
  
  return (
    <table style={{ 
      width: '100%', 
      borderCollapse: 'collapse', 
      textAlign: 'left',
      fontSize: '0.9rem' 
    }}>
      <tbody>
        {entries.map(([key, value]) => (
          <tr key={key} style={{ borderBottom: '1px solid #eee' }}>
            <td 
              style={{ 
                padding: '0.4rem 0.5rem', 
                fontWeight: 'bold', 
                width: '30%', 
                verticalAlign: 'top' 
              }}
            >
              {key}
            </td>
            <td 
              style={{ 
                padding: '0.4rem 0.5rem', 
                wordBreak: 'break-word', 
                width: '70%', 
                verticalAlign: 'top' 
              }}
            >
              {renderDataTable(value)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
// -----------------------------------------------------------------


function ServerHealthCheck() {
  const [rootData, setRootData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        // Fetch /api/v1.4
        const rootRes = await axios.get(API_BASE);
        setRootData(rootRes.data);

        // Fetch /api/v1.4/health
        const healthRes = await axios.get(`${API_BASE}/health`);
        setHealthData(healthRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApi();
  }, []);

  if (loading) return <div>⏳ Loading API data...</div>;
  if (error) return <div>❌ Error: {error}</div>;

  return (
    <div className="grid-container table" style={{ fontFamily: "monospace", padding: "1rem", display: "grid", gap: "1.5rem" }}>
      
      {/* --- Responsive Data Section: API Root Card --- */}
      <div className="card table"
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "1rem",
          // Use flex for simple content display
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "0.5rem",
        }}
      >
        <h2 className= "th" style={{ gridColumn: "1 / -1", margin: 0, paddingBottom: "0.5rem" }}>✅ API v1.4 Root</h2>
        
        {/* Render Root Data in cards (original style) */}
        {rootData ? (
          <div className ="tb" style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
            {renderDataTable(rootData)}
          </div>
        ) : (
          <div>No root api data available.</div>
        )}
      </div>
      
      {/* --- Responsive Data Section: API Health Card (Using Table) --- */}
      <div className="card table"
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "1rem",
        }}
      >
        <h2 className="th"style={{ margin: 0, paddingBottom: "0.5rem" }}>🩺 API v1.4 Health</h2>
        
        {/* Render Health Data in a well-structured table */}
        {healthData ? (
          <div className ="tb" style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
            {renderDataTable(healthData)}
          </div>
        ) : (
          <div>No health data available.</div>
        )}
      </div>
      
    </div>
  );
}

export default ServerHealthCheck;