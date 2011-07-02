var util = require("util"),
    Promise = require("promise").Promise,
    fs = require("fs");

module.exports.tasks = {
    deleteFile: function (options, config, logger) {
        var p = new Promise();
        Array.from(options).each(function(file){
            logger.info("Removing file: " + file);
           fs.unlinkSync(fs.realpathSync(file)); 
        });
        
        return p;
    }
};