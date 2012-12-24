var util = require("util");
var Type = require('./Type.js').abstract;

function Gauge(name, config){    
    this.metric = config.metrics.name;
    Gauge.super_.call(this,name,config);
};

util.inherits(Gauge, Type);
Gauge.prototype.payload = function() {    
    var value = this.value(this.metric, 'sum');
    if ( !value ) return false;

    var from = this.config.from.value;
    if ( !from ) from = this.value(this.config.from.name, 'sum')
    else return {value:value/from};  
};

exports.type = Gauge;