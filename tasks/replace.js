var util = require("util"),
    Promise = require("promise").Promise,
    fs = require("fs");

module.exports.tasks = {
    replace: function(options,config,logger){
        var p = new Promise();
        
        Array.from(options).each(function(opt){
            logger.info("Replacing " + opt.token + " with " + opt.value + " in " + opt.file);
            var original = fs.readFileSync(fs.realpathSync(opt.file), 'utf-8');
            var pattern = new RegExp("\\" + opt.token,"g");
            var final = original.replace(pattern, opt.value);
            fs.writeFileSync(fs.realpathSync(opt.target), final, 'utf-8');
        });
        
        p.resolve(true);
        
        return p;
    }
};