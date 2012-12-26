var util = require("util");
var Type = require('./Type.js').abstract;

function Number(name, config){
    Number.super_.call(this,name,config);    
};

util.inherits(Number, Type);
Number.prototype.setup = function() {
    this.metric = this.config.metric.name;
    this.add(this.config.metric);
    return true;
};

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