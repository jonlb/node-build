//require dependencies
var jxLoader = require('loader/jxLoader').jxLoader,
    Promise = require('promise').Promise,
    fs = require('fs');

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
    var classes = !nil(options.classes) ? options.classes : null;
    var repos = !nil(options.repos) ? options.repos : null;
    var type = !nil(options.type) ? options.type : 'js';
    var includeDeps = !nil(options.includeDeps) ? options.includeDeps : true;
    var theme = !nil(options.theme) ? options.theme : null;
    var exclude = !nil(options.exclude) ? options.exclude : null;
    var opts = !nil(options.opts) ? options.opts : true;
    var compiled = loader.compile(classes, repos, type, includeDeps, theme, exclude, opts);
    _logger.info("returned from compile: " + util.inspect(compiled, false, null));
    fs.writeFileSync(options.target, compiled.source, 'utf-8');
    promise.resolve(true);
}