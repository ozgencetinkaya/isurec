var util = require('util');

function Logger(name, level, logPath, onlyConsole) {
    this.name = name;
    this.level = level; //	debug	info	warn	error
    this.logPath = logPath ;
    this.fs = require('fs');
    this.logFile = null;
    this.onlyConsole = onlyConsole;
    this.init();
}

Logger.prototype.init = function(){
    if(!this.onlyConsole) {
        var now = new Date();
        var dateString = now.getFullYear()+''+now.getMonth()+''+now.getUTCDate();
        this.log_file = this.openFileStream(this.logPath ? this.logPath + '/'+ dateString + '.' + this.level +'.log' : __dirname + '/../logs' + '/'+ dateString + '.'+ this.level + '.log');
    }
};

Logger.prototype.openFileStream = function(path){
    return this.fs.createWriteStream(path, {flags : 'a'});
};

Logger.prototype.changeLevel = function(level) {
    this.level = level;
    if(!this.onlyConsole) {
        this.log_file.close();
        this.init();
    }
};

Logger.prototype.log = function(message) {
    if(!this.onlyConsole) {
        this.log_file.write(new Date().toISOString()+'|'+this.level+'|'+util.format(message) + '\r\n');
    }
    console.log(this.level+'|'+message);
};

Logger.prototype.info = function(message) {
    if(this.level === 'info') {
        this.log(message);
    }
};

Logger.prototype.debug = function(message) {
    if(this.level === 'debug') {
        this.log(message);
    }
};

Logger.prototype.warn = function(message) {
    if(this.level === 'warn') {
        this.log(message);
    }
};

Logger.prototype.error = function(message) {
    if(this.level === 'error') {
        this.log(message);
    }
};


module.exports = Logger;

