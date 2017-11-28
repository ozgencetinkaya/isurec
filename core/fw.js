'use strict';


const Os = require('os');
const Fs = require('fs');
const Path = require('path');
const http = require('http');
const fswatcher = require('./fswatcher/fswatcher');
const constants = require('./const');


var framework = new Framework();
global.framework = global.fw = module.exports = framework;
if (!global.utils)
    global.utils = require('./utils');

var util = global.Utils = global.utils;
var dirwatcher = null;

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

        'controllers_directory': constants.CONTROLLERS_PATH
    };

    this.controllers_path = Path.join(__dirname, '..' , this.config['controllers_directory']);

}

fw.init = function(){
    this.initControllers();
};

fw.initControllers = function(){
    Fs.readdir( Path.join(__dirname, '..' , fw.config['controllers_directory']), function( err, files ){
        if( err ) throw err;

        dirwatcher = fswatcher.createMonitor(fw.controllers_path, {},fw.controllerListener);

        files.forEach( function( file ){
                var file_path = fw.controllers_path + file;
                fw.registerController(file_path);
        });
    });
};

fw.registerController = function(file) {
    console.log(file);
    if( /\.js$/.test( file )){
        delete require.cache[require.resolve(file)];
        var controller = require( file );
        console.log(controller);
        Object.keys( controller ).forEach( function ( action ){
            var name = Path.parse(file)["name"].replace( '.js','' );
            var emptyController = new Controller(action, controller[ action ]);
            if (name === constants.DEFAULT_CONTROLLER) {
                action === '' ? fw.controllers['/' ] = emptyController : fw.controllers[ '/' + action] = emptyController;
            } else {
                action === '' ? fw.controllers['/' + name] = emptyController : fw.controllers['/' + name + '/' + action] = emptyController;
            }
        });
    }
};

fw.unRegisterController = function(file) {
    if( /\.js$/.test( file )){
        var controller = require( file );
        Object.keys( controller ).forEach( function ( action ){

            var name = Path.parse(file)["name"];
            var key = '/' + name + '/' + action;
            console.log(key);
            delete fw.controllers[key];
        });
    }
    delete require.cache[require.resolve(file)];
};


fw.controllerListener = function(monitor){
    monitor.on("created", function (f, stat) {
        console.log("new controller definition created");
        //console.log(f);
        //var file = f.split("\\").pop();
        fw.registerController(f);
    });
    monitor.on("changed", function (f, curr, prev) {
        console.log("controller definition changed");
        //console.log(f);
        //var file = f.split("\\").pop().replace( '.js','' );
        fw.registerController(f);
    });
    monitor.on("removed", function (f, stat) {
        console.log("controller definition removed");
        //console.log(f);
        fw.unRegisterController(f);
    })
    //monitor.stop(); // Stop watching
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

    handler = (handler === '/' || handler === '/'+constants.DEFAULT_CONTROLLER) ? '/index' : handler;

    if(handler === '/favicon.ico') {

        res.end();
    } else {
        console.log(Object.keys(fw.controllers));
        console.log(handler);
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

Controller.prototype.json = function() {
    var jsonReturn = {'test':this.name};
    this.res.write(JSON.stringify(jsonReturn));
};





