var util = require("util");
var Type = require('./Type.js').abstract;

function Gauge(name, config){    
    Gauge.super_.call(this,name,config);

    this.defaultType = 'sum';
    this.metric = config.metrics.name;

    this.from = config.from;
    if ( !config.from.value ) this.add(config.from);
};

util.inherits(Gauge, Type);
Gauge.prototype.payload = function() {    
    var value = this.value(this.metric);
    if ( !value ) return false;

    if ( !this.from.value ) var from = this.value(this.from.name);
    else var from = {data: this.from.value}; 

    if ( !from.data || !value.data ) return false;
    return {value:value.data/from.data};  
};

exports.type = Gauge;