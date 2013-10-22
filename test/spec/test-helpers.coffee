'use strict'
define ['core/catalog', 'chai'], (Catalog, {expect}) ->
  
  init: (context, done)->
    if @catalog?
      context.catalog = @catalog
      return done()
    Catalog.load().done (catalog) =>
      context.catalog = @catalog = catalog
      done()
  testFail: ->
    expect(true).to.be.false
  testSuccess: ->
    expect(true).to.be.true