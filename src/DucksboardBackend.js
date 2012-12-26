var util = require("util");

var Request = require('./Request.js').request;
var Metric = require('./Metric.js').metric;
var Cache = require('./Cache.js').cache;


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
        util.log('loading widget: ' + name);
        this.instance(name, this.defs.widgets[name]);
    }
};

DucksboardBackend.prototype.instance = function(name, config) {
    var format = config.format.split('.');

    var FormatClass = require('./Formats/' + format[0] +  '.js').format;
    this.widgets[name] = new FormatClass(name, config, format[1]);
    return this.widgets[name].setup();
};

DucksboardBackend.prototype.flush = function(timestamp, metrics) {
    util.log('flushing stats at ' + new Date(timestamp * 1000).toString());
    this.update(metrics.counters);
    this.commit();
};

DucksboardBackend.prototype.update = function(counters) {
    var changes = 0;
    for ( metric in counters ) {
        if ( !this.metrics[metric] ) {
            this.metrics[metric] = new Metric(metric, this.defs.metrics[metric], this.cache);
            this.register(this.metrics[metric]);
        }

        if ( this.metrics[metric].set(counters[metric]) ) changes++;
    }

    util.log('changes ' + changes + ' received');
}

DucksboardBackend.prototype.register = function(metric) {
    for ( name in this.widgets ) {
        var widget = this.widgets[name];
        if ( widget.accept(metric.name) ) {
            util.log('metric ' + metric.name + ' accepted by ' + name);
            widget.register(metric);
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
        this.request.send(commit.path, commit.payload);
    }

    util.log('commit: ' + queue.length + ' widget(s) pushed to the server.');
};

exports.backend = DucksboardBackend;