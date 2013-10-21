require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        underscore: '../bower_components/underscore/underscore',
        backbone: '../bower_components/backbone',
        'underscore.string': '../bower_components/underscore.string/dist/underscore.string.min',
        moment: '../bower_components/moment/moment-with-langs'
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

