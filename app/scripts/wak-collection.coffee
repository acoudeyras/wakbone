'use strict'
define ['query-state', 'backbone'], (QueryState)->

  _createDef = (dataClass, model, catalog) ->
    constructor: ->
      @query = new QueryState @, dataClass.dataURI
      Backbone.Collection::constructor.apply @, arguments
    dataClass: dataClass
    catalog: catalog
    model: model
    parse: (response) ->
      @$total = response.__COUNT
      response.__ENTITIES
    url: ->
      @query.url()

  createRelated: (Collection, url) ->
    Collection.extend
      url:url + '&$method=subentityset'
  create: (dataClass, model, catalog) ->
    definition = _createDef dataClass, model, catalog
    Collection = Backbone.Collection.extend(definition)
    Collection.dataClass = dataClass
    Collection.catalog = catalog
    Collection