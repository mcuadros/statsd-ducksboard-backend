var Request = require('../Request.js').request;

function Type(name, config){
 	var self = this;
	this.name = name;
    this.config = config || [];
    this.value = null;

    this.isDraft = false;

 	console.log('Counter:', this.name, this.config);
 
};

Type.prototype.set = function(value) {
 	console.log('please implement set method');
};

Type.prototype.get = function(value) {
	console.log('please implement get method');
};

Type.prototype.draft = function(value) {
	if ( value != 0 ) this.isDraft = true;
	else this.isDraft = false;

	return this.isDraft;
}

Type.prototype.commit = function() {
	if ( !this.isDraft ) return true;

	var req = new Request();
  	req.send(
  		'/v/' + this.name,
  		this.get()
  	);
};

exports.abstract = Type;
