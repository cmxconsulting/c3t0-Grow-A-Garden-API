const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'config.json');
let config = { IPWhitelist: false, WhitelistedIPs: [], Dashboard: true, Port: 3000, UseGithubMutationData: true };

if (fs.existsSync(configPath)) {
  config = { ...config, ...JSON.parse(fs.readFileSync(configPath, 'utf8')) };
} else {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`Created config.json with default settings.`);
}

module.exports = config; 