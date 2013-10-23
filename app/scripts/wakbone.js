(function() {
  require.config({
    paths: {
      jquery: '../bower_components/jquery/jquery',
      underscore: '../bower_components/underscore/underscore',
      backbone: '../bower_components/backbone/backbone',
      'underscore.string': '../bower_components/underscore.string/dist/underscore.string.min',
      moment: '../bower_components/moment/moment'
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

  define(['./core/catalog'], function(Catalog) {
    return Catalog;
  });

}).call(this);
