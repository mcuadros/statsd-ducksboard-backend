require('js-yaml');
var DucksboardBackend = require('./src/DucksboardBackend.js').backend;

exports.init = function(startupTime, config, events) {
    if ( typeof(config.ducksboard.widgets) == 'string' ) {
        var yaml = require(config.ducksboard.widgets);
        config.ducksboard.widgets = yaml;
    }

    var instance = new DucksboardBackend(startupTime, config, events);
    return true;
};


//Require:
//npm install js-yaml
