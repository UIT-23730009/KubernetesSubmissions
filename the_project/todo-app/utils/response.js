// Standardized API response wrapper with forced JSON
export const sendResponse = (res, data, status = 200) => {
  let safeData;

  try {
    // Convert data to JSON-safe format
    safeData = JSON.parse(
      JSON.stringify(data, (_key, value) => {
        if (typeof value === "undefined" || typeof value === "function")
          return null; // undefined or functions -> null
        if (value instanceof RegExp) return value.toString(); // RegExp -> string
        return value;
      }),
    );
  } catch (err) {
    // Fallback if data cannot be stringified
    safeData = { error: "Unserializable data", originalData: String(data) };
  }

  // Force Content-Type header to JSON
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  return res.status(status).json({
    status: status < 300 ? "success" : "error",
    timestamp: new Date().toISOString(),
    data: safeData,
  });
};
