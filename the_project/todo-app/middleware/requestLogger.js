export function requestLogger(req, res, next) {
  const start = Date.now();
    
  // --------------------------
  // Config
  // --------------------------
  const PORT = process.env.TODO_PORT ?? 3000;
  const ENV = process.env.NODE_ENV ?? "development";

  console.log(`→ [${req.method}] ${req.originalUrl}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`← [${res.statusCode}] ${req.originalUrl} (${duration}ms)`);
    console.log(`Source IP: ${req.ip}, User-Agent: ${req.get("User-Agent")}`);
    console.log(`destination: ${req.url}`);
    console.log(`status: ${res.statusCode}`);
    console.log(`timestamp: ${new Date().toISOString()}`);
    console.log(`latency: ${Date.now() - req.startTime}ms`);
    console.log(`memoryUsage: ${JSON.stringify(process.memoryUsage())}`);
    console.log(`uptime: ${process.uptime()} seconds`);
    });

  next();
}
