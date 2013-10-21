'use strict'
define ['catalog'], (Catalog) ->
  
  init: (context, done)->
    if @catalog?
      context.catalog = @catalog
      return done()
    Catalog.load().done (catalog) =>
      context.catalog = @catalog = catalog
      done()