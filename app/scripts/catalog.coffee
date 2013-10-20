'use strict'
define ['./wak-model', './wak-collection', 'backbone'], (wakModelFactory, wakCollectionFactory) ->

  class Catalog
    constructor: (data) ->
      @_dataClasses = data.dataClasses
      @_buildModels()
      @_buildCollections()
    _buildModels: ->
      models = @_dataClasses.map (dataClass) =>
        wakModelFactory.create dataClass, @
      @models = _.indexBy models, 'className'
    _buildCollections: ->
      collections = @_dataClasses.map (dataClass) =>
        model = @models[dataClass.className]
        col = wakCollectionFactory.create dataClass, model, @
      @collections = _.indexBy collections, 'collectionName'
    @load: (success) ->
      $.ajax('/rest/$catalog/$all')
        .then (data) -> new Catalog data