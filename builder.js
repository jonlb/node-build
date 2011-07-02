/**
 * The main builder script
 */

//require mootools
require('mootools').apply(GLOBAL);



var _config,
    _targets = {},
    _logger,
    _queue = [],
    winston = require('logger/winston'),
    fs = require('fs');



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
    _config = config;
    _logger = new (winston.Logger)({
        transports: [
            //new (winston.transports.Console)(),
            new (winston.transports.File)({ filename: logfile })
        ]
    });
    Builder.loadTasks(config.tasks);
    Builder.loadInternalTasks();
    return Builder;
};

Builder.build = function(target) {
    
    _logger.info("Processing target: " + target);
    
    //load the target file
    _targets[target] = (require(_config.targets + "/" + target + ".target"))(_config);
    _logger.debug("Starting target",_targets[target]);
    //start loading in the target's required dependencies 
    if (!nil(_targets[target].depends)) {
        importTargets(_targets[target].depends);
    }
    
    _logger.debug("queue order: ",_queue);
    //and figure out the order
    
    //begin processing targets
    
};

Builder.loadInternalTasks = function(){
    var files = fs.readdirSync(path.normalize(__dirname + "/tasks");
    Array.from(files).each(function(file){
        Builder.loadTasks("./tasks/" + file); 
    });
}


module.exports = Builder;

importTargets = function(depends){
    if (!nil(depends)) {
        Array.from(depends).each(function(d){
            if (!_targets.contains(d)) {
                _targets[d] = (require(_config.targets + "/" + target + ".target"))(_config);
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