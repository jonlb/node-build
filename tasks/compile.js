var util = require("util"),
    Promise = require("promise").Promise,
    fs = require("fs"),
    //jsp = require("uglifyjs/uglify-js").parser,
    //pro = require("uglifyjs/uglify-js").uglify;
    jsmin = require("jsmin").jsmin;

module.exports.tasks = {
    compile: function(options,config,logger){
        var p = new Promise();
        Array.from(options).each(function(opt){
            logger.info("Compressing file: " + opt.file);
            var orig_code = fs.readFileSync(fs.realpathSync(opt.file), 'utf-8'),
                final_code = jsmin(orig_code);
            logger.info("Writing compressed file: " + opt.target);
            fs.writeFileSync(fs.realpathSync(opt.target), final_code, 'utf-8');
            
            /*
            logger.info("\tparse code and get the initial AST");
            var ast = jsp.parse(orig_code); 
            logger.info("\tget a new AST with mangled names");
            ast = pro.ast_mangle(ast);
            logger.info("\tget an AST with compression optimizations");
            ast = pro.ast_squeeze(ast);
            logger.info("\tcompressed code here...");
            var final_code = pro.gen_code(ast);
            logger.info("Writing compressed file: " + opt.target);
            fs.writeFileSync(fs.realpathSync(opt.target), final_code, 'utf-8');
            */
        });
        p.resolve(true);
        return p;
    }
};