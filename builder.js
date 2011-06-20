/**
 * The main builder script
 */
 

var _config,
    _tasks = {};

var Builder = {};

Builder.loadTask = function(filename) {
    var tasks = require(filename).tasks;
    for (var name in tasks) {
        _tasks[name] = tasks[name];
    }
};

Builder.registerTask = function(name, fn){
    _tasks[name] = fn;
};

Builder.addConfig = function(config){
    _config = config;
};

Builder.build = function(target) {
    //load in prebuilt tasks
    loadInternalTasks();
    
};


module.exports = Builder;


loadInternalTasks = function(){
    
};