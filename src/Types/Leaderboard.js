var Leaderboard = require('./Type.js').abstract;
Leaderboard.prototype.initialize = function(name, config) {
    this.metrics = [];
    this.labels = {};
    this.limits = {};

    var limit = false;
    if ( config.limit ) limit = config.limit.split('|');

    if ( config.metrics instanceof Array ) this.initializeWithArray(config, limit);
    else if ( typeof config.metrics == "object" ) this.initializeWithObject(config, limit);
};

Leaderboard.prototype.initializeWithArray = function(config, limit) {
    for ( key in config.metrics ) {
        var metric = config.metrics[key];

        this.metrics.push(metric);
        this.labels[metric] = metric.split('.').pop();
        this.limits[metric] = limit;
    }
};

Leaderboard.prototype.initializeWithObject = function(config, limit) {
    for ( label in config.metrics ) {
        var item = config.metrics[label];

        this.metrics.push(item.metric);
        this.labels[item.metric] = label;

        if ( !limit ) this.limits[item.metric] = item.limit.split('|');
        else this.limits[item.metric] = limit;
    }
};

Leaderboard.prototype.getColor = function(metric, value) {
    var limit = this.limits[metric]; 

    if ( value <= limit[0] ) return 'green';
    else if ( value > limit[0] && value < limit[1] ) return 'yellow';
    else return 'red';
};

Leaderboard.prototype.set = function(value, metric) {
    //TODO
    //this.draft(value);
    this.isDraft = true;
    if ( !this.value ) this.value = {};
    this.value[metric] = value;

    console.log(this.value);
};

Leaderboard.prototype.get = function() {
    var output = [];
    console.log(this.value);
    for (metric in this.value) {
        output.push({
            name: this.labels[metric],
            values: [this.value[metric]],
            status: this.getColor(metric, this.value[metric])
        });
    }

    return {value:{board:output}};
};

exports.type = Leaderboard;
