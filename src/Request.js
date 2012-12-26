var Socket = require('https');

function Request(config){
  var self = this;
  this.host = config.host || 'push.ducksboard.com';
  this.port = config.port || 443;
  this.apikey = config.apikey || false;
};

Request.prototype.getConfig = function(path, payload) {
    return  { 
        host: this.host,
        port: this.port,
        method: 'POST',
        path: path,
        auth: this.apikey + ':x',
        headers: {
            "Content-Length": payload.length,
            "Content-Type": 'application/json'
        }
    };   
};

Request.prototype.send = function(path, payload) {
    var payload = JSON.stringify(payload);
    var options = this.getConfig(path, payload);

    var request = Socket.request(options, function(res, path) {
        if ( res.statusCode != 200 ) {
            util.log('problem with request: ' + res.statusCode);

        }
    });

    request.on('error', function(e, path) {
        util.log('problem with request: ' + e.message);
    });

    
    request.write(payload);

    request.end();
    return request;
}


exports.request = Request;


