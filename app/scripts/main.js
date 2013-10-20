require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        underscore: '../bower_components/underscore/underscore',
        backbone: '../bower_components/backbone',
        'underscore.string': '../bower_components/underscore.string/dist/underscore.string.min'
    },
    shim: {
        backbone: {
            deps: ['underscore', 'jquery']
        },
        'underscore.string': {
            deps: ['underscore']
        }
    }
});

require(['app', 'jquery'], function (app, $) {
    'use strict';
    // use app here
    console.log(app);
    console.log('Running jQuery %s', $().jquery);
});
