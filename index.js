const chalk = require('chalk');
const application = require('./dist');
const configJson = require('./config.json');

module.exports = application;

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT || configJson.port),
      host: process.env.HOST || configJson.host,
      basePath: configJson.basePath || '',
      openApiSpec: {
        // useful when used with OASGraph to locate your application
        setServersFromRequest: true,
      },
      expressSettings: {
        'x-powered-by': false,
      },
    },
  };
  application.main(config).catch((err) => {
    console.error(chalk.bold.red('Cannot start the application.'), err);
    process.exit(1);
  });
}
