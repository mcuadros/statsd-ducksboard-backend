var util = require("util");
var Type = require('./Type.js').abstract;

function Leaderboard(name, config, format){
    Leaderboard.super_.call(this,name,config);

    this.labels = {};
    this.limits = {};
    this.regexp = null;
    this.format = format;
};

util.inherits(Leaderboard, Type);
Leaderboard.prototype.setup = function() {
    if ( this.config.metrics instanceof Array ) this.setupWithArray();
    else if ( this.config.regexp instanceof RegExp ) this.setupWithRegexp();
};

Leaderboard.prototype.setupWithRegexp = function(limit) {
    this.limit = this.config.limit || null;
    this.regexp = this.config.regexp;
};

Leaderboard.prototype.setupWithArray = function() {
    for ( key in this.config.metrics ) {
        var metric = this.config.metrics[key];

        this.add(metric);
        var limit = metric.limit || this.config.limit
        this.limits[metric.name] = limit.split('|');
        this.labels[metric.name] = metric.label || metric.name.split('.').pop();
    }
};

Leaderboard.prototype.accept = function(metric) {
    if ( this.metrics[metric] ) return true;
    else if ( this.regexp ) {
        if ( !metric.match(this.regexp) ) return false;        
        this.add({name:metric})
        return true;
    }
    else return false;
};

Leaderboard.prototype.status = function(metric, value) {
    if ( !this.regexp ) var limit = this.limits[metric]; 
    else var limit = this.limit;

    if ( value <= limit[0] ) return 'green';
    else if ( value > limit[0] && value < limit[1] ) return 'yellow';
    else return 'red';
};

Leaderboard.prototype.label = function(metric) {
    if ( !this.regexp ) return this.labels[metric];
    else return metric.split('.').pop();
};

Leaderboard.prototype.payload = function() {    
    var board = [];
    for ( metric in this.metrics ) {
        var value = this.value(metric);
        if ( !value ) continue;

        var line = {};
        line.name = this.label(metric);
        
        if ( this.format == 'status') {
            line.values = [value.data];
            line.status = this.status(metric, value.data);
        } else {
            line.values = [value.data, this.value(metric, 'last').data];
        }

        board.push(line);

        console.log('status', line.status);
    }

    return { value: { board: board } };
};

exports.type = Leaderboard;
