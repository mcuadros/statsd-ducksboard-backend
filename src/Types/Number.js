var util = require("util");
var Type = require('./Type.js').abstract;

function Counter(name, config){
    Counter.super_.call(this,name,config);
};

util.inherits(Counter, Type);
Counter.prototype.draft = function(value) {
    if ( this.config.delta && value != 0 ) this.isDraft = true;
    else if ( !this.config.delta && value != this.value ) this.isDraft = true;
    else this.isDraft = false;

    return this.isDraft;
}

Counter.prototype.set = function(value) {
    this.draft(value);
    this.value = value;
};

Counter.prototype.get = function(value) {
    if ( this.config.timestamp ){
        return {
            timestamp: parseInt(new Date().getTime()/1000),
            value: this.value
        };
    } 

    if ( this.config.delta ) return {delta:this.value};
    return {value:this.value};
};


exports.type = Counter;