/*
 * statsd-ducksboard-backend
 * https://github.com/yunait/statsd-ducksboard-backend
 *
 * Copyright (c) 2012 Yunait
 * Licensed under the MIT licenses.
 */

var util = require("util");
var Format = require('./Format.js').abstract;

function Number(name, config){
    Number.super_.call(this,name,config);    
};

util.inherits(Number, Format);
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

exports.format = Number;