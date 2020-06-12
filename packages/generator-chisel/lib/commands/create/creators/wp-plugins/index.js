const { runLocal } = require('chisel-shared-utils');
const plugins = require('./plugins.json');

module.exports = (api) => {
  if (api.creator.cmd.skipWpPlugins) return;

  api.schedule(api.PRIORITIES.ASK, async () => {
    await api.prompt([
      {
        type: 'checkbox',
        name: 'plugins',
        message: 'Select optional plugins',
        choices: Object.keys(plugins.plugins),
      },
    ]);
  });

  api.schedule(api.PRIORITIES.WP_PLUGINS, async () => {
    const { plugins: selectedPlugins } = api.creator.data.wpPlugins;
    if (selectedPlugins.length === 0) return;

    return runLocal([
      'chisel-scripts',
      'wp',
      'plugin',
      'install',
      { activate: true },
      ...selectedPlugins.map((name) => plugins.plugins[name]),
    ]);
  });
};
