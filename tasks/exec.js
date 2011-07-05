var util = require("util"),
    Promise = require("promise").Promise,
    spawn = require('child_process').spawn,
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
        
        var opts = Object.merge({ cwd: undefined,
            env: process.env,
            customFds: [-1, -1, -1],
            setsid: false
        },opt.options);
        
        var exec = spawn(opt.cmd,opt.args,opts);
        
        //hook events to get status
        exec.stdout.on("data",function(data){
            logger.info(data);
        });
        
        exec.stderr.on('data', function(data) {
            logger.debug('closure-linter errored: ' + data);
        });
    
        exec.on('exit', function(code) {
            p.resolve(true);
        });
        
        return p;
    }
};