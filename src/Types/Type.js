function Type(name, config){
    var self = this;

    this.name = name;
    this.config = config;
    this.metrics = [];

    this.updated = null;
    this.defaultType = 'last';
};

Type.prototype.setup = function() {
    var metrics = this.config.metrics;
    if ( !Array.isArray(metrics) ) var metrics = [metrics];
    
    for ( key in metrics ) this.add(metrics[key]);
    return true;
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

Type.prototype.register = function(metricObj) {
    if ( !this.accept(metricObj.name) ) return false;
    this.metrics[metricObj.name].obj = metricObj; 
};

Type.prototype.payload = function() {
    return false;
};

Type.prototype.value = function(metric, type) {
    if ( !this.accept(metric) ) return false;

    var metric = this.metrics[metric];
    if ( metric.obj === null ) return false;
    
    var type = type || metric.type;

    var data = metric.obj.get(type);
    console.log('get', metric.type, data);
    //if ( this.metrics[metric].isDraft === true ) {
    return {type:type, data:data};
    //}

    return false;
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




