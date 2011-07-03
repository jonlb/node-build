//require dependencies
var jxLoader = require('loader/jxLoader').jxLoader,
    Promise = require('promise').Promise,
    fs = require('fs'),
    util = require("util");

//the loader instance itself
var loader = null,
    _logger;

module.exports.tasks = {
    combine: function(options, config, logger){
        var p = new Promise();
        _logger = logger;
        if (loader == null) {
            loader = new jxLoader(config.loader.base);
            loader.addEvent('loadRepoDone', function(){
               runCombine(options, p); 
            });
            loader.addRepository(config.loader.repos);
        } else {
            runCombine(options, p); 
        }
        return p;
        
    },
    
    createDeps: function(options, config, logger){
        var p = new Promise();
        _logger = logger;
        if (loader == null) {
            loader = new jxLoader(config.loader.base);
            loader.addEvent('loadRepoDone', function(){
               fs.writeFileSync(options.target + '/deps.json',JSON.stringify(loader.getRepoArray),'utf-8')
               p.resolve(true);
            });
            loader.addRepository(config.loader.repos);
        } else {
            fs.writeFileSync(options.target + '/deps.json',JSON.stringify(loader.getRepoArray),'utf-8');
            p.resolve(true);
        }
        return p;
    }
};


var runCombine = function(options, promise) {
    _logger.info("options passed into runCombine: " + util.inspect(options,false,null));
    
    Array.from(options).each(function(opts){
        var classes = !nil(opts.classes) ? opts.classes : null;
        var repos = !nil(opts.repos) ? opts.repos : null;
        var type = !nil(opts.type) ? opts.type : 'js';
        var includeDeps = !nil(opts.includeDeps) ? opts.includeDeps : true;
        var theme = !nil(opts.theme) ? opts.theme : null;
        var exclude = !nil(opts.exclude) ? opts.exclude : null;
        var opts = !nil(opts.opts) ? opts.opts : true;
        var compiled = loader.compile(classes, repos, type, includeDeps, theme, exclude, opts);
        //_logger.info("returned from compile: " + util.inspect(compiled, false, null));
        console.warn("writing to target: " + opts.target);
        fs.writeFileSync(opts.target, compiled.source, 'utf8');
    });
    promise.resolve(true);
}