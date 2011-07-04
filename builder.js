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
    sys = require("sys"),
    when = require("promise").when,
    Promise = require("promise").Promise;



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
    
    //add the Builder to the config
    config.builder = Builder;
    
    Builder.loadTasks(config.tasks);
    Builder.loadInternalTasks();
    return Builder;
};

Builder.build = function(target, config) {
    var p = new Promise();
    config = nil(config) ? _config : config;
    
    _logger.info("Processing target: " + target);
    
    //load the target file
    fn = require(_config.targets + "/" + target + ".target");
    _targets[target] = fn(config, _logger);
    _logger.info("Starting target" + util.inspect(_targets[target], false, null));
    //start loading in the target's required dependencies 
    if (!nil(_targets[target].depends)) {
        importTargets(_targets[target].depends);
    }
    
    _queue.push(target);
    
    _logger.info("queue order: " + util.inspect(_queue, false, null));
    //begin processing targets
    runTargets().then(function(){ p.resolve(true);});
    return p;
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
    _logger.debug("in ImportTargets for " + util.inspect(depends,false,null));
    if (!nil(depends)) {
        Array.from(depends).each(function(d){
            if (!Object.keys(_targets).contains(d)) {
                _targets[d] = (require(_config.targets + "/" + d + ".target"))(_config,_logger);
                _logger.info("Target config for " + d + ":\n" + util.inspect(_targets[d],false,null));
                if (!nil(_targets[d].depends)) {
                    importTargets(_targets[d].depends);
                }
                _queue.push(d);
                
            }
        });
    }
};

var _stack;

runTargets = function(){
    var target = _queue.shift(),
        p = new Promise();
    
    if (_stack !== undefined && _stack.length > 0) {
        _stack = _stack.unshift(Array.clone(_targets[target].tasks));
    } else {
         _stack = Array.clone(_targets[target].tasks);
    }
    
    _logger.info("\n\n!!!!!!!!!!!!!\nExecuting target: " + target);
    _logger.info("Target description: " + _targets[target].description);
    _logger.info("Number of tasks: " + _stack.length);
    
    executeTarget(target).then(function(){
        if (_queue.length > 0) { 
            runTargets();
        } else {
            p.resolve(true);
        }
    });
    
    return p;
};



executeTarget = function(){
    var p = new Promise();
    
    var task = _stack.shift(),
        taskName = Object.keys(task)[0],
        options = task[taskName];
        
    _logger.info("running task: " + taskName);
    _tasks[taskName](options, _config, _logger).then(function(){
        _logger.info("Promise resolved from task: " + taskName);
        if (_stack.length == 0) {
            _logger.info("No more tasks...");
            p.resolve(true);
        } else {
            _logger.info("On to next task!!!");
            executeTarget().then(function(){p.resolve(true);});
        }
    }, function(err){
        p.reject(err);
    });
       
    return p;
};
            
