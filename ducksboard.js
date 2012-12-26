/*
* Push metrics to Ducksboard (http://ducksboard.com/).
* 
* You must include 'statsd-ducksboard-backend' in the array backeds 
* from your config file to enable it.
*
*   backends: ['statsd-ducksboard-backend']
*
* The backend will read the configuration options from the following
* 'librato' hash defined in the main statsd config file:
*
*   ducksboard : {
*       apikey : API Key from ducksboards.com (req'd)
*       definitions : YAML file or array with the widget defs (req'd)
*       cache: Folder where the cache files will be stored (optional)
*   }
*/

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
