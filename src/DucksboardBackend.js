var Counter = require('./Types/Counter.js').type;


function DucksboardBackend(startupTime, config, emitter){
    var self = this;
    this.metrics = {};
    this.config = config.ducksboard || [];
    this.init();
    
    emitter.on('flush', function(timestamp, metrics) { console.log(metrics); self.flush(timestamp, metrics); });
    emitter.on('status', function(callback) { self.status(callback); });
};

DucksboardBackend.prototype.init = function() {
    for (name in this.config.metrics) this.instanceMetric(name, this.config.metrics[name]);
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
    for ( metric in metrics.counters ) {
        if ( this.metrics[metric] ) this.metrics[metric].set(metrics.counters[metric], true);
    } 

    this.commit();
};

DucksboardBackend.prototype.commit = function() {
    for ( metric in this.metrics ) this.metrics[metric].commit();
};

exports.backend = DucksboardBackend;