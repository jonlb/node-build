/**
 * The main builder script
 */

//require mootools
require('mootools').apply(GLOBAL);



var _config,
    _targets = {},
    _logger,
    _queue = [],
    _tasks = {},
    winston = require('logger/winston'),
    fs = require('fs'),
    path = require("path"),
    util = require("util"),
    sys = require("sys");



var Builder = {};

Builder.loadTasks = function(filename) {
    Array.from(filename).each(function(file){
        var tasks = require(file).tasks;
        for (var name in tasks) {
            _logger.info("loading task: " + name);
            _tasks[name] = tasks[name];
        }
    });
};


Builder.config = function(config, logfile){
    
    _logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({level: "silly"}),
            new (winston.transports.File)({ filename: logfile, level: "silly" })
        ]
    });
    _logger.emitErrs = false;
    
    if (nil(config)) {
        _logger.debug("config is nil");
    } else {
        _logger.debug("config is not nil");
        _logger.info("config: " + util.inspect(config, false, null));
    }
    
    _logger.debug("The passed in config");
    _config = config;
    
    Builder.loadTasks(config.tasks);
    Builder.loadInternalTasks();
    return Builder;
};

Builder.build = function(target) {
    
    _logger.info("Processing target: " + target);
    
    //load the target file
    fn = require(_config.targets + "/" + target + ".target");
    _targets[target] = fn(_config, _logger);
    _logger.info("Starting target" + util.inspect(_targets[target], false, null));
    //start loading in the target's required dependencies 
    if (!nil(_targets[target].depends)) {
        importTargets(_targets[target].depends);
    }
    
    _queue.push(target);
    
    _logger.info("queue order: " + util.inspect(_queue, false, null));
    //and figure out the order
    
    //begin processing targets
};

Builder.loadInternalTasks = function(){
    var taskPath = path.normalize(__dirname + "/tasks");
        files = fs.readdirSync(taskPath);
    Array.from(files).each(function(file){
        Builder.loadTasks(taskPath + "/" + file); 
    });
}


module.exports = Builder;

importTargets = function(depends){
    _logger.debug("in ImportTargets for ", depends);
    if (!nil(depends)) {
        Array.from(depends).each(function(d){
            if (!_targets.contains(d)) {
                _targets[d] = (require(_config.targets + "/" + target + ".target"))(_config);
                _logger.info("Target config for " + d + ":\n" + util.inspect(_targets[d],false,null));
                if (!nil(_targets[d].depends)) {
                    importTargets(_targets[d].depends);
                } else {
                    _queue.push(d);
                }
            }
        });
    }
};

calculateDependencies = function(target){
    
};
