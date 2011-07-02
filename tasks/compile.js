var util = require("util"),
    Promise = require("promise").Promise,
    fs = require("fs"),
    jsp = require("uglifyjs/uglify-js").parser,
    pro = require("uglifyjs/uglify-js").uglify;

module.exports.tasks = {
    compile: function(options,config,logger){
        var p = new Promise();
        Array.from(options).each(function(opt){
            logger.info("Compressing file: " + opt.file);
            var orig_code = fs.readFileSync(fs.realpathSync(opt.file), 'utf-8');
            var ast = jsp.parse(orig_code); // parse code and get the initial AST
            ast = pro.ast_mangle(ast); // get a new AST with mangled names
            ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
            var final_code = pro.gen_code(ast); // compressed code here
            logger.info("Writing compressed file: " + opt.target);
            fs.writeFileSync(fs.realpathSync(opt.target), final_code, 'utf-8');
        });
        p.resolve(true);
        return p;
    }
};