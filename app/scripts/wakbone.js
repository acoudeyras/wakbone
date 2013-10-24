/*
require.config(
  paths:
    jquery: '../bower_components/jquery/jquery'
    underscore: '../bower_components/underscore/underscore'
    backbone: '../bower_components/backbone/backbone'
    'underscore.string': '../bower_components/underscore.string/dist/underscore.string.min'
    moment: '../bower_components/moment/min/moment-with-langs'
    epoxy: '../bower_components/backbone.epoxy/backbone.epoxy'
  shim:
    backbone:
      deps: ['underscore', 'jquery']
    'underscore.string':
      deps: ['underscore']
    epoxy:
      deps: ['backbone']
)
*/


(function() {
  define(['./core/catalog', './views/wak-views'], function(Catalog, WakViews) {
    return {
      load: function() {
        return Catalog.load().then(function(catalog) {
          return {
            catalog: catalog,
            views: new WakViews(catalog)
          };
        });
      }
    };
  });

}).call(this);
