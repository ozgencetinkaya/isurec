'use strict';


const Os = require('os');
const Fs = require('fs');
const Path = require('path');
const http = require('http');


var framework = new Framework();
global.framework = global.fw = module.exports = framework;
if (!global.utils)
    global.utils = require('./utils');

var util = global.Utils = global.utils;

function Framework() {

    this.$id = null; // might be used later
    this.version = 1000;
    this.version_header = '1.0.0';
    this.version_node = process.version.toString();
    console.log(this.version_node);
    this.controllers = {};
    this.constants = require('./const');

    this.config = {

        debug: false,

        name: 'nodeb',
        version: '1.0.0',
        author: 'ozgen',
        machine_secret: Os.hostname() + '-' + Os.platform() + '-' + Os.arch(),

        'controllers_directory': './app/controllers/'
    }

}

fw.init = function(){
    this.initControllers();
};

fw.initControllers = function(){
    Fs.readdir( Path.join(__dirname, '..' , fw.config['controllers_directory']), function( err, files ){
        if( err ) throw err;
        files.forEach( function( file ){
            var controllers_path = Path.join(__dirname, '..' , fw.config['controllers_directory']);
            var file_path = controllers_path + file;
            console.log("a");
            Fs.watchFile(file_path,fw.controllerListener);
            console.log(file_path);
            if( /\.js$/.test( file )){
                var controller = require( file_path );
                Object.keys( controller ).forEach( function ( action ){
                    var name = file.replace( '.js','' );
                    var emptyController = new Controller(action, controller[ action ]);
                    action === '' ? fw.controllers[ '/' + name ] = emptyController : fw.controllers[ '/' + name + '/' + action ] = emptyController;
                });
            }
        });
    });
};

fw.controllerListener = function(curr, prev){
    console.log('contoller file is changed ');
    console.log(curr);
    console.log(prev);
};

fw.serve = function(host, port){
    this.init();

    var PORT = 80;
    if(port) PORT = port;
    var HOST = "localhost";
    if(host) HOST = host;

    var server = http.createServer( ).listen( PORT, HOST );

    server.on('request', fw.requesthandler );
};

fw.requesthandler = function(req, res) {

    var uri = utils.parseURI(req);

    var handler = uri.pathname;

    handler = (handler === '/' || handler === '/default') ? '/default/index' : handler;

    if(handler === '/favicon.ico') {

        res.end();
    } else {
        if( fw.controllers[ handler ]){
            try{
                fw.controllers[ handler ].requesthandler( req, res );
            }catch( err ){
                res.error( 500, err );
            }
        }else{
            console.log("else");
        }
    }
};

function Controller(name, fun) {
    this.name = name;
    this.fun = fun;
    this.viewName = name;
    this.model = name;
}

Controller.prototype.header = function(name, value) {
    this.res.setHeader(name, value);
    return this;
};

Controller.prototype.requesthandler = function (req, res){
    this.req = req;
    this.res = res;
    this.fun();
    res.end();
};

Controller.prototype.view = function() {
    this.res.write(this.name);
};





