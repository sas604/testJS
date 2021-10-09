const pino = require('pino');
const pinoInstance = pino();
const fs = require('fs');

const logger = {
  logInfo: pinoInstance.info.bind(pinoInstance), // bind pinoinstance to logInfo will refer to
  logError: pinoInstance.error.bind(pinoInstance),
  log: (msg) => fs.appendFileSync('/tmp/logs.out', msg + '\n'),
};

module.exports = logger;
