'use strict'
define ['backbone'], ->

  _createDef = (dataClass, model, catalog) ->
    url: dataClass.dataURI
    className: dataClass.className
    collectionName: dataClass.collectionName
    catalog: catalog
    model: model
    parse: (response) ->
      @$total = response.__COUNT
      response.__ENTITIES

  create: (dataClass, model, catalog) ->
    definition = _createDef dataClass, model, catalog
    Collection = Backbone.Collection.extend(definition)
    new Collection()