//require dependencies
var jxLoader = require('loader/jxLoader').jxLoader,
    Promise = require('promise').Promise,
    fs = require('fs-promise');

//the loader instance itself
var loader = null;



modules.exports.tasks = {
    combine: function(options, config){
        var p = new Promise();
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
    
    createDeps: function(options, config){
        var p = new Promise();
        if (loader == null) {
            loader = new jxLoader(config.loader.base);
            loader.addEvent('loadRepoDone', function(){
               fs.writeFile(options.target + '/deps.json',JSON.stringify(loader.getRepoArray),'utf-8')
               .then(function(){ p.resolve(true); },
               function(err){ p.reject(err); });
            });
            loader.addRepository(config.loader.repos);
        } else {
            fs.writeFile(options.target + '/deps.json',JSON.stringify(loader.getRepoArray),'utf-8')
            .then(function(){ p.resolve(true); },
            function(err){ p.reject(err); });
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
    fs.writeFile(options.target, compiled, 'utf-8').then(function(){
        promise.resolve(true); 
    }, function(err){
        promise.reject(err);
    });
}