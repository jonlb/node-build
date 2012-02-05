var fs = require('fs');

var basedir = fs.realpathSync(__dirname + "/.."),
    config = {
        project: { 
            basedir: basedir,  //the base drectory of the entire project
            "default": "deploy" //the default target that should be run when --target option is not specified
        },
        //This section is optional and can be used for passing all manner of options and configs for the targets
        //to use
        app: {
            name: "jxlib",
            path: "/jxlib",
            version: "3.1b3",
            home: basedir,
            build: basedir + "/build",
            dist: basedir + "/dist",
            deploy: basedir + "/www",
            docs: basedir + "/www/reference",
            vendor: basedir + "/vendor",
            utils: basedir + "/utils"
        }
    };

//Used by the exec task to locate external dependencies
config.dependencies = {
    NaturalDocs: config.app.utils + "/NaturalDocs-1.4/NaturalDocs"
};

//configuration options for jxLoader task/npm module
config.loader = {
    base: {
        'moveImages': false,
        'rewriteImageUrl': false,
        debug: false
    },
    repos: {
        'core': {
            'paths': {
                'js': config.app.vendor + "/mootools-core/Source"
            }
        },
        'more': {
            'paths': {
                'js': config.app.vendor + "/mootools-more/Source"
            }
        },
        'jxlib': {
            'paths': {
                'js': config.app.build + '/Source',
                'css': config.app.build + '/themes/{theme}/css',
                'cssalt': config.app.build + '/themes/{theme}'
                //'images': jxLibPath + '/themes/{theme}/images'
            }
        }
    }
};

//List your custom tasks here
config.tasks = [];

module.exports = config;