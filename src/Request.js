var Socket = require('https');

function Request(){
  var self = this;
  this.host = 'push.ducksboard.com';
  this.port = 443;
  this.apikey = 'YKXqSeBaoynCqSmaXzImKnaqEJrncLFgJniegTWvRqJZFm1KOz';
};

Request.prototype.setAPIKey = function(apikey) {
    this.apikey = apikey;
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
    console.log(options,payload);

    var request = Socket.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });

   // request.setHeader("Content-Type", "text/html");
    request.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });
    
    request.write(payload);

    request.end();
    return request;
}


exports.request = Request;


