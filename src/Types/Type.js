function Type(name, config){
    var self = this;

    this.name = name;
    this.config = config;
    this.metrics = [];

    this.updated = null;
    this.empty = true;
};

Type.prototype.setup = function() {
    if ( !Array.isArray(this.config.metrics) ) this.config.metrics = [this.config.metrics];
    var metrics = {};

    for ( key in this.config.metrics ) {
        var metric = this.config.metrics[key];
        metrics[metric.name] = metric;
    }

    this.config.metrics = metrics;
    return true;
};

Type.prototype.accept = function(metric) {
    var metrics = this.config.metrics;
    for ( key in metrics) {
        if ( metrics[key].name == metric ) {
            this.empty = false;
            return true;
        }
    }
    
    return false;
};

Type.prototype.apply = function(metric) {
    if ( !this.accept(metric.name) ) return false;
    return this.metrics[metric.name] = metric; 
};

Type.prototype.payload = function() {
    return false;
};

Type.prototype.value = function(metric, type) {
    if ( this.empty ) return false;



   // if ( this.metrics[metric].isDraft === true ) {
        return this.metrics[metric].get(type);
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




