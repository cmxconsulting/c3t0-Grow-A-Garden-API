const blessed = require('blessed');

function createDashboard() {
  const screen = blessed.screen({
    smartCSR: true,
    title: 'GAG Dashboard | By 3itx'
  });

  const settingsBox = blessed.box({
    top: 0,
    left: '0%',
    width: '50%',
    height: '20%',
    tags: true,
    border: { type: 'line' },
    style: { border: { fg: 'cyan' } },
    label: ' Settings '
  });

  const perfBox = blessed.box({
    top: 0,
    left: '50%',
    width: '50%',
    height: '20%',
    tags: true,
    border: { type: 'line' },
    style: { border: { fg: 'magenta' } },
    label: ' Performance '
  });

  const activityBox = blessed.box({
    top: '20%',
    left: '0%',
    width: '100%',
    height: '60%',
    tags: true,
    border: { type: 'line' },
    scrollable: true,
    alwaysScroll: true,
    style: { border: { fg: 'green' } },
    label: ' Activity '
  });

  const consoleBox = blessed.box({
    bottom: 0,
    left: 'center',
    width: '100%',
    height: '20%',
    tags: true,
    border: { type: 'line' },
    scrollable: true,
    alwaysScroll: true,
    style: { border: { fg: 'yellow' } },
    label: ' Console '
  });

  screen.append(settingsBox);
  screen.append(perfBox);
  screen.append(activityBox);
  screen.append(consoleBox);
  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
  screen.render();

  return { screen, settingsBox, perfBox, activityBox, consoleBox };
}

module.exports = { createDashboard }; 