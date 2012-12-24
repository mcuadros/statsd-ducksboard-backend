var util = require("util");
var Type = require('./Type.js').abstract;

function Counter(name, config){
    this.metric = config.metrics.name;
    Counter.super_.call(this,name,config);
};

util.inherits(Counter, Type);
Counter.prototype.payload = function() {    
    var config = this.config.metrics[this.metric];
    var value = this.value(this.metric, config.type || 'sum');
    if ( !value ) return false;
    else {
        if ( config.type == 'delta' ) return {delta:value};
        else return {value:value}; 
    } 
};

exports.type = Counter;