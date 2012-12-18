var Request = require('./Request.js').request;
var Counter = require('./Types/Counter.js').type;

function DucksboardBackend(startupTime, config, emitter){
    var self = this;
    this.metrics = {};
    this.config = config.ducksboard || [];
    this.request = new Request(this.config);

    this.init();
    
    emitter.on('flush', function(timestamp, metrics) { console.log(metrics); self.flush(timestamp, metrics); });
    emitter.on('status', function(callback) { self.status(callback); });
};

DucksboardBackend.prototype.init = function() {
    for (name in this.config.metrics) {
        console.log('Loading metric:', name, this.config.metrics[name]);
        this.instanceMetric(name, this.config.metrics[name]);
    }
};

DucksboardBackend.prototype.instanceMetric = function(name, config) {
    switch(config.type) {
        case 'counter': 
            this.metrics[name] = new Counter(name, config);
            break;
        default:
            console.error('not valid metric type'); 
    }
};

DucksboardBackend.prototype.status = function(callback) {
    console.log('status', callback);
};

DucksboardBackend.prototype.flush = function(timestamp, metrics) {
    console.log('Flushing stats at', new Date(timestamp * 1000).toString());

    for ( metric in metrics.counters ) {
        if ( this.metrics[metric] ) this.metrics[metric].set(metrics.counters[metric], true);
    } 

    this.commit();
};

DucksboardBackend.prototype.commit = function() {
    var queue = [];
    for ( metric in this.metrics ) {
        var commit = this.metrics[metric].commit() 
        if ( commit ) queue.push(commit);
    }

    for ( key in queue) {
        var commit = queue[key];
        console.log('Requesting:', commit.name, commit.payload);
        this.request.send(commit.path, commit.payload);
    }

    console.log('Commit: %d metric(s) pushed to the server.', queue.length);
};

exports.backend = DucksboardBackend;