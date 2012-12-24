var util = require("util");
var Type = require('./Type.js').abstract;

function Leaderboard(name, config){
    Leaderboard.super_.call(this,name,config);

    this.labels = {};
    this.limits = {};
    this.regexp = null;
    this.limit = null;
};

util.inherits(Leaderboard, Type);
Leaderboard.prototype.setup = function() {
    var limit = false;
    var config = this.config;
    if ( config.limit ) limit = config.limit.split('|');

    if ( config.metrics instanceof Array ) this.initializeWithArray(limit);
    else if ( config.metrics instanceof RegExp ) this.initializeWithRegexp(limit);
    else if ( typeof config.metrics == "object" ) this.initializeWithObject(limit);
};

Leaderboard.prototype.initializeWithRegexp = function(limit) {
    this.limit = limit;
    this.regexp = this.config.metrics;
};

Leaderboard.prototype.initializeWithArray = function(limit) {
    for ( key in this.config.metrics ) {
        var metric = this.config.metrics[key];

        this.metrics.push(metric);
        this.labels[metric] = metric.split('.').pop();
        this.limits[metric] = this.limit;
    }
};

Leaderboard.prototype.initializeWithObject = function(limit) {
    for ( label in this.config.metrics ) {
        var item = this.config.metrics[label];

        this.metrics.push(item.metric);
        this.labels[item.metric] = label;

        if ( !this.limit ) this.limits[item.metric] = item.limit.split('|');
        else this.limits[item.metric] = this.limit;
    }
};

Leaderboard.prototype.accept = function(metric) {
    if ( !this.regexp ) {
        if ( this.metrics.indexOf(metric) == -1 ) return false;
        else return true;
    } else {
        if ( metric.match(this.regexp) ) return true;
        else return false;
    }
};

Leaderboard.prototype.draft = function(value, metric) {
    if ( !this.value ) this.isDraft = true;
    else if ( !this.value[metric] ) this.isDraft = true;
    else if ( this.value[metric] != value ) this.isDraft = true;
    
    return this.isDraft;
};

Leaderboard.prototype.set = function(value, metric) {
    this.draft(value, metric);
    
    if ( !this.value ) this.value = {};
    this.value[metric] = value;
};

Leaderboard.prototype.get = function() {
    var output = [];
    for (metric in this.value) {
        output.push({
            name: this.getLabel(metric),
            values: [this.value[metric]],
            status: this.getColor(metric, this.value[metric])
        });
    }

    return {value:{board:output}};
};

Leaderboard.prototype.getColor = function(metric, value) {
    if ( !this.regexp ) var limit = this.limits[metric]; 
    else var limit = this.limit;

    if ( value <= limit[0] ) return 'green';
    else if ( value > limit[0] && value < limit[1] ) return 'yellow';
    else return 'red';
};

Leaderboard.prototype.getLabel = function(metric) {
    if ( !this.regexp ) return this.labels[metric];
    else return metric.split('.').pop();
};


exports.type = Leaderboard;
