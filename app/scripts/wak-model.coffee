'use strict'
define ['helpers', 'backbone'], (helpers)->

  _deleteProperties = (data) ->
    for key, val of data
      if typeof val is 'object'
        _deleteProperties val
      else if key in _send.propertiesToDelete
        delete data[key]

  _send = (model, data, action, options) ->
    _deleteProperties data
    data = JSON.stringify data
    newOptions =
      type: action.verb
      url: model.urlRoot + '/?$method=' + action.wakMethod
      data: data
      dataType: 'json'
      contentType: 'application/json'
    $.ajax $.extend {}, options, newOptions
  _send.PUT =
    verb: 'POST'
    wakMethod: 'update'
  _send.propertiesToDelete = ['uri']

  _fieldsToRemove = ['__entityModel', '__KEY', '__STAMP', 'id', 'ID', 'uri']

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
    sync: (method, model, options) ->
      return Backbone.Model::sync.apply @, arguments if method is 'read'
      helpers.throwIf method isnt 'update', "method #{method} not supported yet"
      #TODO delete
      data = model.changedAttributes()
      return helpers.resolvedPromise() if not data
      data.__KEY = model.id
      data.__STAMP = model.get '$stamp'
      _send(model, data, _send.PUT, options)

  create: (dataClass, catalog) ->
    definition = _createDef dataClass, catalog
    Model = Backbone.Model.extend(definition)
    Model.className = dataClass.className
    Model.catalog = catalog
    Model