var util = require("util"),
    Promise = require("promise").Promise,
    wrench = require("wrench"),
    fs = require("fs");

module.exports.tasks = {
    copyDir: function (options, config, logger) {
        var p = new Promise();
        options.copy.each(function(dir){
            var from = fs.realpathSync(options.basedirs.from + "/" + dir),
                to = fs.realpathSync(options.basedirs.to + "/" + dir);
            logger.info("Copying " + from + " to " + to);
            wrench.copyDirSyncRecursive(from, to);
        });
        p.resolve(true);
        return p;
    }
};