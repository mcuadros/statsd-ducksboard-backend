function Type(name, config){
    var self = this;
    this.value = null;
    this.isDraft = false; 
    this.name = name;
    this.config = config;

    this.initialize(name, config);
};

Type.prototype.initialize = function(name, config) {
    if ( config.metrics instanceof Array ) this.metrics = config.metrics;
    else this.metrics = [config.metrics];
};

Type.prototype.accept = function(metric) {
    if ( this.metrics.indexOf(metric) == -1 ) return false;
    else return true;
};

Type.prototype.draft = function(value) {
    if ( value != 0 ) this.isDraft = true;
    else this.isDraft = false;

    return this.isDraft;
}

Type.prototype.commit = function() {
    if ( !this.isDraft ) return false;
    this.isDraft = false;

    return {
        name: this.name,
        path: '/v/' + this.name,
        payload: this.get()
    };
};

Type.prototype.set = function() {
    console.log('please implement set method');
};

Type.prototype.get = function() {
    console.log('please implement get method');
};


exports.abstract = Type;
