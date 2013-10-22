'use strict'
define [], ->

  _fieldsToRemove = ['__entityModel', '__KEY', '__STAMP', 'id', 'ID', 'uri']

  _removePropertiesNotInDataclass = (data, dataClass, attrNames) ->
    attrNames ?= _.pluck dataClass.attr(), 'name'
    for key, val of data
        if typeof val is 'object'
          _removePropertiesNotInDataclass val, dataClass, attrNames
        else if key not in attrNames
          delete data[key]

  class ModelSerializer
    constructor: (@model) ->
      @dataClass = @model.dataClass
    toJSON: ->
      data = @model.changedAttributes()
      return null if not data

      data.__KEY = @model.id
      data.__STAMP = @model.get '$stamp'    
      _removePropertiesNotInDataclass data, @dataClass    
      JSON.stringify data
    fromJSON: (data) ->
      result = {}
      for key, value of data
        continue if key in _fieldsToRemove
        attr = @dataClass.attr key
        result[key] = attr.fromRaw value
      
      result.$stamp = data.__STAMP
      result.id = data.ID
      result