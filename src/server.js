const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');
const cors = require('cors');
const config = require('./config');
const { createDashboard } = require('./dashboard');
const { setupLogger, formatLogEntry } = require('./logger');

let dashboard;
if (config.Dashboard) {
  dashboard = createDashboard();
  setupLogger(dashboard);
}

const app = express();
const PORT = config.Port || 3000;

app.use(cors());

const activityLog = [];

function formatIP(ip) {
  if (typeof ip !== 'string') return ip;
  if (ip.startsWith('192.168.')) return ip;
  return ip;
}

function updateSettings() {
  if (config.Dashboard) {
    dashboard.settingsBox.setContent(
      `IP Whitelisting: ${config.IPWhitelist}\n` +
      `Whitelisted IPs: ${config.WhitelistedIPs.join(', ') || 'None'}\n` +
      `Port: ${config.Port}`
    );
  }
}

function updateActivity() {
  if (config.Dashboard) {
    dashboard.activityBox.setContent(activityLog.join('\n'));
    dashboard.activityBox.setScrollPerc(100);
  }
}

function updatePerf() {
  const mem = process.memoryUsage();
  const usedMemMB = (mem.rss / 1024 / 1024).toFixed(2);
  const loadAvg = os.platform() === 'win32' ? [0, 0, 0] : os.loadavg();
  const uptimeInSeconds = process.uptime();
  
  const days = Math.floor(uptimeInSeconds / (24 * 3600));
  const hours = Math.floor((uptimeInSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeInSeconds % 60);

  const uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

  if (config.Dashboard) {
    dashboard.perfBox.setContent(
      `{bold}RAM Usage:{/bold} ${usedMemMB} MB\n` +
      `{bold}CPU Load (1m, 5m, 15m):{/bold} ${loadAvg.map(v => v.toFixed(2)).join(', ')}\n` +
      `{bold}Uptime:{/bold} ${uptime}`
    );
    dashboard.screen.render();
  }

  return {
    usedMemMB,
    loadAvg,
    uptime
  };
}

function updateUI() {
  updateSettings();
  updateActivity();
  if (config.Dashboard) {
    dashboard.screen.render();
  }
}

console.log('🚀 Started Host');
if (config.IPWhitelist) {
  console.log(`IP Whitelisting ENABLED. Allowed IPs: ${config.WhitelistedIPs.join(', ') || 'None'}`);
} else {
  console.log(`IP Whitelisting DISABLED.`);
}

app.use((req, res, next) => {
  let rawIp;

  if (config.IPWhitelist) {
    rawIp = req.connection.remoteAddress || '';
  } else {
    rawIp = req.headers['x-forwarded-for'] ||
            req.headers['x-real-ip'] ||
            req.connection.remoteAddress || '';
  }

  const ip = rawIp.includes('::ffff:') ? rawIp.split('::ffff:')[1] : rawIp;
  const timestamp = new Date().toISOString();

  const logEntry = formatLogEntry(timestamp, req.method, req.originalUrl, formatIP(ip), !config.Dashboard);
  activityLog.push(logEntry);

  if (config.IPWhitelist && !config.WhitelistedIPs.includes(ip)) {
    console.log(`[403] Blocked IP: ${formatIP(ip)}`);
    updateUI();
    return res.status(403).json({ error: 'Forbidden' });
  }

  console.log(logEntry);
  updateUI();
  next();
});


app.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

const routesDir = path.join(__dirname, 'routes');
if (!fs.existsSync(routesDir)) fs.mkdirSync(routesDir);

let loadCount = 0;

fs.readdir(routesDir, (err, files) => {
  if (err) {
    console.log(`Failed to read routes directory: ${err.message}`);
    return;
  }

  files.forEach(file => {
    if (file.endsWith('.js')) {
      const routePath = path.join(routesDir, file);
      try {
        const routeModule = require(routePath);
        if (typeof routeModule.register === 'function') {
          routeModule.register(app);
          console.log(`[Loader] Registered module: ${file}`);
          loadCount++;
        } else {
          console.log(`[Loader] No register() export in ${file}`);
        }
      } catch (error) {
        console.log(`[Loader] Error in ${file}: ${error.message}`);
      }
    }
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server live at http://localhost:${PORT}`);
    console.log(`Available endpoints: GET /status`);
    console.log(`This GAG API is made by 3itx | https://github.com/just3itx | Add Credits if you wanna modify`);
    updateUI();
  });
});

setInterval(() => {
  updatePerf();
}, 1000);

process.on('uncaughtException', (err, origin) => {
  console.error(`Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
