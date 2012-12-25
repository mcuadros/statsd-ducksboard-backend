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
    
    if ( value.type == 'delta' ) return {delta:value.data};
    else return {value:value.data};  
};

exports.type = Number;