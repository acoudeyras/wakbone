'use strict'
define ['backbone'], ->

  _fieldsToRemove = ['__entityModel', '__KEY', '__STAMP', 'id', 'ID']

  _createDef = (dataClass, catalog) ->

    constructor: (options, collection) ->
      options.id ?= options.ID
      Backbone.Model::constructor.apply @, arguments
    parse: (response) ->
      data = {}
      for key, value of response
        continue if key in _fieldsToRemove
        attr = dataClass.attr key
        data[key] = attr.fromRaw value
      
      data.$stamp = response.__STAMP
      data.id = response.ID
      data

    urlRoot: dataClass.dataURI
    url: -> @urlRoot + '(' + @id + ')'

  create: (dataClass, catalog) ->
    definition = _createDef dataClass, catalog
    Model = Backbone.Model.extend(definition)
    Model.className = dataClass.className
    Model.catalog = catalog
    Model