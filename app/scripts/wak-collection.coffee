'use strict'
define ['backbone'], ->

  class QueryState
    constructor:(@col)->
    filter:(fieldName, val, op) ->
    orderBy: () ->
    top: (top) ->
      @_top = top
      @
    limit: (limit) ->
      @_limit = limit
      @
    expand: (expand) ->

  _createDef = (dataClass, model, catalog) ->
    constructor: ->
      @$state = new QueryState @
      Backbone.Collection::constructor.apply @, arguments
    url: dataClass.dataURI
    className: dataClass.className
    collectionName: dataClass.collectionName
    catalog: catalog
    model: model
    parse: (response) ->
      @$total = response.__COUNT
      response.__ENTITIES

  createRelated: (Collection, url) ->
    Collection.extend
      url:url + '&$method=subentityset'
  create: (dataClass, model, catalog) ->
    definition = _createDef dataClass, model, catalog
    Collection = Backbone.Collection.extend(definition)
    Collection