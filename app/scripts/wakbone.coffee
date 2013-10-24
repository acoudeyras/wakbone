###
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
###
define ['./core/catalog', './views/wak-views'], (Catalog, WakViews) ->
  load: ->
    Catalog.load().then (catalog) ->
      catalog: catalog
      views: new WakViews(catalog)

