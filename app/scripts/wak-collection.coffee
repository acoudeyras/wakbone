'use strict'
define ['./rest-query', 'backbone'], (RestQuery)->

  class QueryState
    constructor:(@collection, state)->
      @state = _.extend QueryState.default, state
    filter:(fieldName, val, op) ->
    orderBy: () ->
    skip: (skip) ->
      @state.skip = skip
      @
    limit: (limit) ->
      @state.limit = limit
      @
    expand: (expand) ->
    url: -> 
      query = new RestQuery @collection.url
      query.skip @state.top
      query.url

    @default:
      skip: 0
      limit: 100

  _createDef = (dataClass, model, catalog) ->
    constructor: ->
      @query = new QueryState @
      Backbone.Collection::constructor.apply @, arguments
    url: dataClass.dataURI
    className: dataClass.className
    collectionName: dataClass.collectionName
    catalog: catalog
    model: model
    parse: (response) ->
      @$total = response.__COUNT
      response.__ENTITIES
    fetch: ->
      url = @query.url()
      console.log url
      Backbone.Collection::fetch.apply @, arguments

  createRelated: (Collection, url) ->
    Collection.extend
      url:url + '&$method=subentityset'
  create: (dataClass, model, catalog) ->
    definition = _createDef dataClass, model, catalog
    Collection = Backbone.Collection.extend(definition)
    Collection