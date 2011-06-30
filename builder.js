/**
 * The main builder script
 */

//require mootools
require('mootools').apply(GLOBAL);

var _config,
    _tasks = {};



var Builder = {};

Builder.loadTasks = function(filename) {
    Array.from(filename).each(function(file){
        var tasks = require(file).tasks;
        for (var name in tasks) {
            _tasks[name] = tasks[name];
        }
    });
};


Builder.addConfig = function(config){
    _config = config;
};

Builder.build = function(target) {
    
    //load the target file for the required target
    
    //start loading in the target's required dependencies 
    //and figure out the order
    
    //begin processing targets
    
};


module.exports = Builder;


