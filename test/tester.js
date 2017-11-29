fw = require ('../core/fw');
var EventEmitter = require('events').EventEmitter;
var state = new EventEmitter;

fw.serve();

var http = require('http');

exports.test = function (host,path){
    http.get({
        host: host,
        path: path
    }, function(response) {

        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {

            console.log(body);
        });
    });
};
