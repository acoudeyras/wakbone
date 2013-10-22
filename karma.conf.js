// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {

  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

   plugins: [
      'karma-coffee-preprocessor',
      'karma-chrome-launcher',
      'karma-osx-reporter',
      'karma-requirejs',
      'karma-coverage',
      'karma-mocha',
      'karma-chai-plugins'
   ],

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['requirejs', 'mocha', 'chai', 'chai-as-promised'],   

    // list of files / patterns to load in the browser
    files: [
      {pattern: 'app/scripts/**/*.js', included: false},
      {pattern: 'app/bower_components/**/*.js', included: false},
      {pattern:'test/spec/**/*.js', included: false},
      {pattern:'test/spec/*helpers.js', included:false},
      'test/mock/**/*.js',
      'test/test-main.js'
    ],

    reporters: ['progress', 'coverage', 'osx'],
    //reporters: ['progress', 'coverage'],

    preprocessors: {
      //'**/*.coffee': ['coffee'],
      'app/scripts/**/*.js': ['coverage']
    },

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8081,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    captureTimeout: 10000,

    proxies: {
      '/rest': 'http://localhost:8088/rest'
    },

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
