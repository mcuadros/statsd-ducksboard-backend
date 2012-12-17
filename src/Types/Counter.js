var Counter = require('./Type.js').abstract;
Counter.prototype.set = function(value) {
    this.draft(value);
    
    console.log('setting|' + this.name + ': "' + value + '"');
    this.value = value;
};

Counter.prototype.get = function(value) {
    return {delta:this.value};
};

exports.type = Counter;
