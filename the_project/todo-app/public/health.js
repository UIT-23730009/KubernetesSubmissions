async function loadHealth() {
  try {
    const res = await fetch(`api/${window.APP_CONFIG.API_VERSION}/health`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const result = await res.json();
    const health = result.data;

    const html = `
            <div class="card">
                <h2>System Status: 
                    <span class="status green">HEALTHY</span>
                </h2>
                <p>Message: ${health.message}</p>
                <p>Uptime: ${Math.floor(health.uptime)} seconds</p>
                <p>App Version: ${health.appVersion}</p>
                <p>API Version: ${health.apiVersion}</p>
                <p>Session ID: ${health.sessionId}</p>
                <p>Last Updated: ${new Date(result.timestamp).toLocaleString()}</p>
            </div>

            <div class="card">
                <h3>Memory Usage</h3>
                <pre>${JSON.stringify(health.memoryUsage, null, 2)}</pre>
            </div>

            <div class="card">
                <h3>Available Endpoints</h3>
                <ul>
                    ${health.endpoints.map((e) => `<li>${e}</li>`).join("")}
                </ul>
            </div>
        `;

    document.getElementById("dynamic-content").innerHTML = html;
  } catch (err) {
    document.getElementById("dynamic-content").innerHTML = `
            <div class="card">
                <h2>Error Loading Health</h2>
                <span class="status red">FAILED</span>
            </div>
            <pre>${err}</pre>
        `;
  }
}

loadHealth();
setInterval(loadHealth, 864000);
