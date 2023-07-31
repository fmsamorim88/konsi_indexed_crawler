// wdio.conf.js
exports.config = {
    runner: 'local',
    specs: [
      './test/specs/*.js'
    ],
    capabilities: [{
      browserName: 'chrome' // Use 'firefox' para Firefox ou 'safari' para Safari
    }],
    logLevel: 'info',
    baseUrl: 'http://extratoclube.com.br/', // Substitua pela URL do portal que você deseja fazer login
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['chromedriver'],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
      ui: 'bdd',
      timeout: 60000
    }
  };
  