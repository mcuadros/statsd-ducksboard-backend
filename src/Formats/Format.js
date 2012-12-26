function Format(name, config){
    var self = this;

    this.name = name;
    this.config = config;
    this.metrics = [];

    this.updated = null;
    this.defaultType = config.type || 'sum';
};

Format.prototype.add = function(config) {
    var metric = [];
    metric.name = config.name || exit();
    metric.type = config.type || this.defaultType;
    metric.timestamp = config.timestamp || false;
    metric.obj = null;

    return this.metrics[metric.name] = metric;
};

Format.prototype.accept = function(metric) {
    if ( this.metrics[metric] ) return true;
    else return false;
};

Format.prototype.register = function(obj) {
    if ( !this.accept(obj.name) ) return false;
    this.metrics[obj.name].obj = obj; 
};

Format.prototype.payload = function() {
    return false;
};

Format.prototype.value = function(metric, type) {
    if ( !this.accept(metric) ) return false;

    var metric = this.metrics[metric];
    if ( metric.obj === null ) return false;
    
    var output = {};
    output.config = metric
    output.data = metric.obj.get(type || metric.type);
    if ( metric.timestamp ) output.timestamp = metric.obj.get('updated');

    return output;
};

Format.prototype.commit = function() {
    var payload = this.payload();
    if ( !payload ) return false;

    this.updated = Date.now();
    return {
        name: this.name,
        path: '/v/' + this.name,
        payload: payload
    };
};

exports.abstract = Format;




