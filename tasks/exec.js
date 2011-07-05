var util = require("util"),
    Promise = require("promise").Promise,
    exec = require('child_process').exec,
    fs = require("fs");

module.exports.tasks = {
    exec: function(options,config,logger){
        var p = new Promise();
        
        logger.info("platform is: " + process.platform);
        //grab the correct options
        var opt;
        Array.from(options).each(function(o){
           if (o.os.contains(process.platform)){
                opt = o;
           }
        });
        
        //run it
        command = exec(opt.cmd, opt.options,
          function (error, stdout, stderr) {
            logger.info('stdout: ' + stdout);
            logger.error('stderr: ' + stderr);
            if (error !== null) {
              logger.error('exec error: ' + error);
            }
        });
        
        return p;
    }
};