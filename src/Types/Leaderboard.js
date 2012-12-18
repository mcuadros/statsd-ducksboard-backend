var Leaderboard = require('./Type.js').abstract;
Leaderboard.prototype.set = function(value, metric) {
    //TODO
    //this.draft(value);
    this.isDraft = true;
    if ( !this.value ) this.value = {};
    this.value[metric] = value;

    console.log(this.value);
};

Leaderboard.prototype.get = function(value) {
    var output = [];
    console.log(this.value);
    for (metric in this.value) {
        output.push({
            name: metric,
            values: [this.value[metric]],
            status: 'green'
        });
    }

    return {value:{board:output}};
};

exports.type = Leaderboard;
