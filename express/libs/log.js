const winston = require('winston');
const path = require('path');

function getLogger(module) {
  const fileName = path.basename(module.filename);

  return new winston.Logger({
    transports: [
      new winston.transports.Console({
        colorize: true,
        level: 'debug',
        label: fileName
      })
    ]
  });
}

module.exports = getLogger;
