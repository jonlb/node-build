var util = require("util"),
    Promise = require("promise").Promise,
    fs = require("fs");

module.exports.tasks = {
    mkdir: function(options,config,logger){
        var p = new Promise();
        Array.from(options).each(function(d){
            logger.info("Making directory: " + d);
            fs.mkdirSync(d);
        });
        p.resolve(true);
        return p;
    }
};