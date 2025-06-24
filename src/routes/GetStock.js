const https = require("https");

const options = {
    method: "GET",
    hostname: "growagarden.gg",
    port: null,
    path: "/api/stock",
    headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        priority: "u=1, i",
        referer: "https://growagarden.gg/stocks",
        "trpc-accept": "application/json",
        "x-trpc-source": "gag"
    }
};

let cachedStockData = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function fetchStocks() {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            const chunks = [];
            res.on("data", (chunk) => {
                chunks.push(chunk);
            });

            res.on("end", () => {
                try {
                    const body = Buffer.concat(chunks);
                    const parsedData = JSON.parse(body.toString());
                    resolve(parsedData);
                } catch (err) {
                    reject(err);
                }
            });
        });

        req.on("error", (e) => {
            reject(e);
        });

        req.end();
    });
}

function formatItems(items, imageData, isLastSeen = false) {
    if (!Array.isArray(items) || items.length === 0) return [];

    return items.map(item => {
        const image = imageData?.[item.name] || null;
        const baseItem = {
            name: item?.name || "Unknown",
            ...(image && { image })
        };

        if (isLastSeen) {
            return {
                ...baseItem,
                emoji: item?.emoji || "❓",
                seen: item?.seen ?? null,
            };
        } else {
            return {
                ...baseItem,
                value: item?.value ?? null,
            };
        }
    });
}

function formatStocks(stocks) {
    const imageData = stocks.imageData || {};

    return {
        easterStock: formatItems(stocks.easterStock, imageData),
        gearStock: formatItems(stocks.gearStock, imageData),
        eggStock: formatItems(stocks.eggStock, imageData),
        nightStock: formatItems(stocks.nightStock, imageData),
        honeyStock: formatItems(stocks.honeyStock, imageData),
        cosmeticsStock: formatItems(stocks.cosmeticsStock, imageData),
        seedsStock: formatItems(stocks.seedsStock, imageData),

        lastSeen: {
            Seeds: formatItems(stocks.lastSeen?.Seeds, imageData, true),
            Gears: formatItems(stocks.lastSeen?.Gears, imageData, true),
            Weather: formatItems(stocks.lastSeen?.Weather, imageData, true),
            Eggs: formatItems(stocks.lastSeen?.Eggs, imageData, true),
            Honey: formatItems(stocks.lastSeen?.Honey, imageData, true)
        },

        restockTimers: stocks.restockTimers || {},
    };
}

async function fetchStockData() {
    try {
        const data = await fetchStocks();
        return formatStocks(data);
    } catch (err) {
        console.error("Error fetching stock data:", err);
        return null;
    }
}

function register(app) {
    app.get('/api/stock', async (req, res) => {
        const now = Date.now();
        if (cachedStockData && (now - lastFetchTime < CACHE_DURATION)) {
            return res.json(cachedStockData);
        }

        try {
            const stockData = await fetchStockData();
            if (!stockData) {
                return res.status(500).json({ error: "Failed to fetch stock data" });
            }
            
            cachedStockData = stockData;
            lastFetchTime = now;
            
            res.json(stockData);
        } catch (err) {
            res.status(500).json({ error: "Error fetching stock data" });
        }
    });
}

module.exports = { register };
