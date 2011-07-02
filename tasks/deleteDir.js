var util = require("util"),
    Promise = require("promise").Promise,
    wrench = require("wrench");

module.exports.tasks = {
    deleteDir: function(options,config,logger){
        var p = new Promise();
        Array.from(options).each(function(dir){
            logger.info("removing directory: " + dir);
            wrench.rmdirSyncRecursive(dir);
        });
        p.resolve(true);
        return p;
    }
};