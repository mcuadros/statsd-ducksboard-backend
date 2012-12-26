function Type(name, config){
    var self = this;

    this.name = name;
    this.config = config;
    this.metrics = [];

    this.updated = null;
    this.defaultType = config.type || 'sum';
};

Type.prototype.add = function(config) {
    var metric = [];
    metric.name = config.name || exit();
    metric.type = config.type || this.defaultType;
    metric.timestamp = config.timestamp || false;
    metric.obj = null;

    return this.metrics[metric.name] = metric;
};

Type.prototype.accept = function(metric) {
    if ( this.metrics[metric] ) return true;
    else return false;
};

Type.prototype.register = function(obj) {
    if ( !this.accept(obj.name) ) return false;
    this.metrics[obj.name].obj = obj; 
};

Type.prototype.payload = function() {
    return false;
};

Type.prototype.value = function(metric, type) {
    if ( !this.accept(metric) ) return false;

    var metric = this.metrics[metric];
    if ( metric.obj === null ) return false;
    
    var output = {};
    output.config = metric
    output.data = metric.obj.get(type || metric.type);
    if ( metric.timestamp ) output.timestamp = metric.obj.get('updated');

    return output;
};

Type.prototype.commit = function() {
    var payload = this.payload();
    if ( !payload ) return false;

    console.log('payload', payload);

    this.updated = Date.now();
    return {
        name: this.name,
        path: '/v/' + this.name,
        payload: payload
    };
};

exports.abstract = Type;




