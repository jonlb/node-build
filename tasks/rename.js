var util = require("util"),
    Promise = require("promise").Promise,
    fs = require("fs");

module.exports.tasks = {
    rename: function(options,config,logger){
        var p = new Promise();
    
        Array.from(options).each(function(opt){
            var from = fs.realpathSync(opt.from);
            fs.renameSync(from, to);
        });
        
        p.resolve(true);
        return p;
    
    }
};