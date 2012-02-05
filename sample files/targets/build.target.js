
//passes in the config object and a logger object so you can reference config options
//and do logging (the logger is an instance of the winston logger.
module.exports = function(config,logger) {
  
    //return an object with the info for this target
    return {
        name: "build",  //target name you reference it by
        description: "Build the Jx library", //a short description of the target
        depends: "prepare", //any target dependencies. use an array of strings if there is more than one.
        //start your list of tasks here. this should be an array of objects.
        tasks: [{
            callTarget: {
                target: "theme",
                params: {
                    theme: "crispin"
                }
            }
        },{
            callTarget: {
                target: "theme",
                params: {
                    theme: "delicious"
                }
            }
        }]
    };
};