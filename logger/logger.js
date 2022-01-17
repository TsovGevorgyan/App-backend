const fs = require('fs');
const path = require('path');
const logPath = path.join(__dirname, 'log.txt');

const logger = (error, functionName) => {
  const errorText = `Catch for: ${functionName} || ${error.message}`;
  console.error(errorText);

  fs.appendFileSync(logPath, errorText);
};

module.exports = logger;
