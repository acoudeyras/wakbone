'use strict'
define ['catalog'], (Catalog) ->
  
    init: (done)->
      return done() if @catalog?
      Catalog.load().done (catalog) =>
        console.log 'Loading catalog'
        @catalog = catalog
        done()