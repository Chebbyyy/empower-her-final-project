// middleware/logger.js
const chalk = require('chalk');

/**
 * Express middleware to log incoming HTTP requests
 */
const logger = (req, res, next) => {
  const method = req.method;
  const url = req.originalUrl;
  const time = new Date().toISOString();

  console.log(
    `${chalk.green('[REQUEST]')} ${chalk.cyan(time)} - ${chalk.yellow(method)} ${chalk.magenta(url)}`
  );

  // Optionally, log response status when finished
  res.on('finish', () => {
    const status = res.statusCode;
    let statusColor = chalk.green;
    if (status >= 400 && status < 500) statusColor = chalk.yellow;
    if (status >= 500) statusColor = chalk.red;

    console.log(
      `${chalk.green('[RESPONSE]')} ${chalk.cyan(time)} - ${statusColor(status)} ${chalk.magenta(method)} ${chalk.yellow(url)}`
    );
  });

  next();
};

module.exports = logger;
