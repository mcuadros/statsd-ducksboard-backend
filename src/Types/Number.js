var Counter = require('./Type.js').abstract;
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
    if ( this.config.delta ) return {delta:this.value};
    else return {value:this.value};
};

exports.type = Counter;
