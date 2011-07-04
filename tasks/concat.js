var util = require("util"),
    Promise = require("promise").Promise,
    fs = require("fs"),
    files;


var addFile = function (stream, p) {
    var file = files.shift();
    
    readstream = fs.createReadStream(file, { encoding: 'utf-8' });
    
    readstream.on("end",function(){
        if (files.length > 0) {
            readstream.close();
            addFile(stream,p);
        } else {
            p.resolve(true);
        }
    });
    
    readstream.pipe(stream, {end: false});
};

module.exports.tasks = {
    concat: function (options, config, logger) {
        var p = new Promise(),
            newFile = fs.createWriteStream(options.target);
            
        files = Array.clone(options.files);
        addFile(newFile, p);
        return p;
    }
};


