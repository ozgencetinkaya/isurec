var tester = require('./tester');

var host = "localhost";

//test index route
tester.test(host,"/");

//test show route
tester.test(host,"/show");

//test dummy route
tester.test(host,"/dummy");

/*var logger = require('../core/logmanager');

var a = new logger("a","debug",null,false);

a.debug("test message")
a.debug("2nd test message")

a.changeLevel("info")

a.info("1st info message");
a.debug("debug message");
    */