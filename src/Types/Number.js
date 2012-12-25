var util = require("util");
var Type = require('./Type.js').abstract;

function Number(name, config){
    Number.super_.call(this,name,config);
    this.metric = config.metrics.name;
    this.defaultType = 'sum';
};

util.inherits(Number, Type);
Number.prototype.payload = function() {    
    var value = this.value(this.metric);
    if ( !value ) return false;
    
    var output = {};
    if ( value.config.type == 'delta' ) output.delta = value.data;
    else output.value = value.data;  

    if ( value.timestamp ) output.timestamp = value.timestamp;
    return output;
};

exports.type = Number;