const https = require("https");

const WEATHER_API_PATH = "/api/weather/stats";
let cachedWeatherData = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1 * 60 * 1000; // 1 minute

function createOptions(path) {
  return {
    method: "GET",
    hostname: "growagarden.gg",
    path: path,
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      priority: "u=1, i",
      referer: "https://growagarden.gg/weather",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 OPR/119.0.0.0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    },
  };
}

function fetchWeatherStats(path) {
  return new Promise((resolve, reject) => {
    const options = createOptions(path);
    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (err) {
          reject(new Error("Failed to parse JSON: " + err.message));
        }
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    req.end();
  });
}

function register(app) {
  app.get("/api/weather", async (req, res) => {
    const now = Date.now();
    if (cachedWeatherData && (now - lastFetchTime < CACHE_DURATION)) {
        return res.json(cachedWeatherData);
    }

    try {
      const stats = await fetchWeatherStats(WEATHER_API_PATH);
      cachedWeatherData = stats;
      lastFetchTime = now;
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message || "Failed to fetch weather stats" });
    }
  });
}

module.exports = { register };
