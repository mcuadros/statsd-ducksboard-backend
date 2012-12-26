/*
 * statsd-ducksboard-backend
 * https://github.com/yunait/statsd-ducksboard-backend
 *
 * Copyright (c) 2012 Yunait
 * Licensed under the MIT licenses.
 */

var util = require("util");
var Format = require('./Format.js').abstract;

function Gauge(name, config){    
    Gauge.super_.call(this,name,config);
};

util.inherits(Gauge, Format);
Gauge.prototype.setup = function() {
    if ( !this.config.dividend.value ) this.add(this.config.dividend);
    if ( !this.config.divisor.value ) this.add(this.config.divisor);
    return true;
};

Gauge.prototype.dividend = function() {
    if ( this.config.dividend.value ) return this.config.dividend.value;
    var dividend = this.value(this.config.dividend.name);
    return dividend.data;
};

Gauge.prototype.divisor = function() {
    if ( this.config.divisor.value ) return this.config.divisor.value;
    var divisor = this.value(this.config.divisor.name);
    return divisor.data;
};

Gauge.prototype.payload = function() {    
    var dividend = this.dividend();
    var divisor = this.divisor();

    if ( !dividend || !divisor ) return false;
    return {value:dividend/divisor};  
};

exports.format = Gauge;