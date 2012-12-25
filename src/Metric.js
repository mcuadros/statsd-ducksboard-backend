function Metric(name, config, cache){
    var self = this;
    this.name = name;
    this.config = config || [];
    this.cache = cache;
    this.isDraft = false;

    this.setup(this.cache.read(this.name));
};

Metric.prototype.setup = function(value) {
    if ( value ) return this.value = value;

    this.value = {
        avg:null, //the average value
        count:0, //the number of hits
        first:null, //the first value
        last:null, //the last value
        max:null, //the largest value
        min:null, //the smallest value
        sum:0, //the sum
        delta:null, //the delta
        since:null, //the timestamp of the first value
        updated:null //the timestamp of the last value
    };
};

Metric.prototype.draft = function(value) {
    if ( !this.config.allowZero && value == 0 ) this.isDraft = false;
    else if ( this.value.last == value ) this.isDraft = null;
    else this.isDraft = true;

    return this.isDraft;
};

Metric.prototype.set = function(value) {
    this.reset();
    if ( this.draft(value) === false )  return false;

    if ( this.value.last ) this.value.delta = value - this.value.last;
    if ( !this.value.first ) this.value.first = value;
    if ( !this.value.since ) this.value.since = Date.now();

    if ( !this.value.max || value > this.value.max ) this.value.max = value;
    if ( !this.value.min || value < this.value.min ) this.value.min = value;

    this.value.sum += value;
    this.value.count++;
    this.value.last = value;
    this.value.avg = this.value.sum / this.value.count;
    this.value.updated = Date.now();

    this.cache.save(this.name, this.value);
    return true;
};

Metric.prototype.get = function(type) {
    return this.value[type];
};

Metric.prototype.reset = function() {
    if ( !this.value.updated ) return false;
    if ( !this.config.reset ) return false;

    var date = new Date(this.value.updated);
    switch(this.config.reset) {
        case 'month': 
            if ( date.getMonth() != new Date().getMonth() ) this.setup();
            break;
        case 'day': 
            if ( date.getDay() != new Date().getDay() ) this.setup();
            break;
        case 'hour': 
            if ( date.getHours() != new Date().getHours() ) this.setup();
            break;
    }

    return true;
};

exports.metric = Metric;


