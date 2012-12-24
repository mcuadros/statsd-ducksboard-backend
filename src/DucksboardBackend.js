var util = require("util");

var Request = require('./Request.js').request;
var Metric = require('./Metric.js').metric;
var Cache = require('./Cache.js').cache;

var Gauge = require('./Types/Gauge.js').type;
var Number = require('./Types/Number.js').type;
var Leaderboard = require('./Types/Leaderboard.js').type;

function DucksboardBackend(startupTime, config, emitter){
    var self = this;
    this.widgets = {};
    this.metrics = {};

    this.config = config.ducksboard || [];
    this.defs = this.config.definitions;

    this.request = new Request(this.config);
    this.cache = new Cache(this.config);

    this.init();
    
    emitter.on('flush', function(timestamp, metrics) { self.flush(timestamp, metrics); });
};

DucksboardBackend.prototype.init = function() {
    for (name in this.defs.widgets) {
        util.log('Loading widget: ' + name);
        this.instanceWidget(name, this.defs.widgets[name]);
    }
};

DucksboardBackend.prototype.instanceWidget = function(name, config) {
    switch(config.type.split('.')[0]) {
        case 'number': 
            this.widgets[name] = new Number(name, config);
            break;
        case 'gauge': 
            this.widgets[name] = new Gauge(name, config);
            break;
        case 'leaderboard': 
            this.widgets[name] = new Leaderboard(name, config);
            break;
        default:
            util.error('not valid metric type'); 
            return false;
    }

    return this.widgets[name].setup();
};

DucksboardBackend.prototype.flush = function(timestamp, metrics) {
    util.log('Flushing stats at ' + new Date(timestamp * 1000).toString());
    this.update(metrics.counters);
    this.commit();
};

DucksboardBackend.prototype.update = function(counters) {
    var changes = 0;
    for ( metric in counters ) {
        if ( !this.metrics[metric] ) {
            this.metrics[metric] = new Metric(metric, this.defs.metrics[metric], this.cache);
            this.apply(this.metrics[metric]);
        }

        if ( this.metrics[metric].set(counters[metric]) ) changes++;
    }

    console.log('Changes %d', changes);
}

DucksboardBackend.prototype.apply = function(metric) {
    for ( name in this.widgets ) {
        var widget = this.widgets[name];
        if ( widget.accept(metric.name) ) {
            util.log('Metric ' + metric.name + ' accepted by ' + name);
            widget.apply(metric);
        }
    }
};

DucksboardBackend.prototype.commit = function() {
    var queue = [];
    for ( widget in this.widgets ) {
        var commit = this.widgets[widget].commit() 
        if ( commit ) queue.push(commit);
    }

    for ( key in queue) {
        var commit = queue[key];
        console.log('Requesting:', commit.name, commit.payload);
        this.request.send(commit.path, commit.payload);
    }

    util.log('Commit: ' + queue.length + ' widget(s) pushed to the server.');
};

exports.backend = DucksboardBackend;