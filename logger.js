const pino = require('pino');
const pinoInstance = pino();

const logger = {
  logInfo: pinoInstance.info.bind(pinoInstance), // bind pinoinstance to logInfo will refer to this file instead og loger object
  logError: pinoInstance.error.bind(pinoInstance),
};

module.exports = logger;
