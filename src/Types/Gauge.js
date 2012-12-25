var util = require("util");
var Type = require('./Type.js').abstract;

function Gauge(name, config){    
    Gauge.super_.call(this,name,config);

    this.defaultType = 'sum';
    this.metric = config.metrics.name;
   // if ( config.from.name ) this.valid[config.from.name] = config.from;

};

util.inherits(Gauge, Type);
Gauge.prototype.payload = function() {    
    var value = this.value(this.metric);
    if ( !value ) return false;

    var from = this.config.from.value;
    if ( !from ) from = this.value(this.config.from.name)
    else return {value:value/from};  
};

exports.type = Gauge;