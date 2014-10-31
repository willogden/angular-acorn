module.exports = function(config) {
    config.set({
        basePath: '',
        //logLevel: config.LOG_DEBUG,

        autoWatch: false,
        singleRun: false,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],


    })
}
