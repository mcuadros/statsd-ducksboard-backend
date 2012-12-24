require('js-yaml');
var DucksboardBackend = require('./src/DucksboardBackend.js').backend;

exports.init = function(startupTime, config, events) {
    if ( typeof(config.ducksboard.definitions) == 'string' ) {
        var yaml = require(config.ducksboard.definitions);
        config.ducksboard.definitions = yaml;
    }

    var instance = new DucksboardBackend(startupTime, config, events);
    return true;
};


//Require:
//npm install js-yaml
