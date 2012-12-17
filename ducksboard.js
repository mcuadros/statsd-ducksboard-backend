var DucksboardBackend = require('./src/DucksboardBackend.js').backend;

exports.init = function(startupTime, config, events) {
  var instance = new DucksboardBackend(startupTime, config, events);
  return true;
};