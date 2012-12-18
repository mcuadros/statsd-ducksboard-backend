var Request = require('./Request.js').request;
var Number = require('./Types/Number.js').type;
var Leaderboard = require('./Types/Leaderboard.js').type;

function DucksboardBackend(startupTime, config, emitter){
    var self = this;
    this.widgets = {};
    this.config = config.ducksboard || [];
    this.request = new Request(this.config);

    this.init();
    
    emitter.on('flush', function(timestamp, metrics) { console.log(metrics); self.flush(timestamp, metrics); });
    emitter.on('status', function(callback) { self.status(callback); });
};

DucksboardBackend.prototype.init = function() {
    for (name in this.config.widgets) {
        console.log('Loading widget:', name, this.config.widgets[name]);
        this.instanceWidget(name, this.config.widgets[name]);
    }
};

DucksboardBackend.prototype.instanceWidget = function(name, config) {
    switch(config.type.split('.')[0]) {
        case 'number': 
            this.widgets[name] = new Number(name, config);
            break;
        case 'leaderboard': 
            this.widgets[name] = new Leaderboard(name, config);
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
    for ( metric in metrics.counters ) this.apply(metric, metrics.counters[metric]);

    this.commit();
};

DucksboardBackend.prototype.apply = function(metric, value) {
    var done = false;
    for ( widgetName in this.widgets ) {
        var widget = this.widgets[widgetName];
        //TODO: meter setter con nombre de clave
        if ( widget.accept(metric) ) {
            console.log('Metric %s accepted by %s', metric, widgetName);
            widget.set(value, metric);
            done = true;
        }
    }

    return done;
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

    console.log('Commit: %d widget(s) pushed to the server.', queue.length);
};

exports.backend = DucksboardBackend;