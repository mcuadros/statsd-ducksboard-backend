/*
 * statsd-ducksboard-backend
 * https://github.com/yunait/statsd-ducksboard-backend
 *
 * Copyright (c) 2012 Yunait
 * Licensed under the MIT licenses.
 */

var FileSystem = require('fs');

function Cache(config){
    var self = this;
    this.folder = config.cache || null;
};

Cache.prototype.save = function(metric, data) {
    if ( !this.folder ) return null;
    return FileSystem.writeFileSync(this.getFilename(metric), JSON.stringify(data));
};

Cache.prototype.read = function(metric) {
    if ( !this.folder ) return null;

    var file = this.getFilename(metric);
    if ( !this.fileExists(file) ) return null;

    var data = FileSystem.readFileSync(file);
    return JSON.parse(data);
};

Cache.prototype.getFilename = function(metric) {
    return this.folder + metric + '.json';
};

Cache.prototype.fileExists = function(file) {  
    try { return FileSystem.statSync(file); }  
    catch(error) { return false; }  
};

exports.cache = Cache;


