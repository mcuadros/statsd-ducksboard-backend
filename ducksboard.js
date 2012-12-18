require('js-yaml');
var DucksboardBackend = require('./src/DucksboardBackend.js').backend;

exports.init = function(startupTime, config, events) {
    if ( typeof(config.ducksboard.metrics) == 'string' ) {
        var yaml = require(config.ducksboard.metrics);
        config.ducksboard.metrics = yaml;
        console.log(yaml);
    }

    var instance = new DucksboardBackend(startupTime, config, events);
    return true;
};


//Require:
//npm install js-yaml
