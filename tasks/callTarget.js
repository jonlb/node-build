var util = require("util"),
    Promise = require("promise").Promise,
    fs = require("fs"),
    path = require("path");

module.exports.tasks = {
    callTarget: function (options, config, logger) {
        var p = new Promise();
        
        //first, copy passed in params to the config object
        config.params = options.params;
        
        config.builder.build(options.target, config).then(function(){
            p.resolve(true);
        });
        
        return p;
    }
};