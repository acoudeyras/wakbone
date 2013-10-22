'use strict'
define ['backbone'], ->

  _fieldsToRemove = ['__entityModel', '__KEY', '__STAMP', 'id', 'ID', 'uri']
  _removePropertiesNotInDataclass = (data, dataClass, attrNames, alreadyVisited) ->
    alreadyVisited ?= []
    attrNames ?= _.pluck dataClass.attr(), 'name'
    result = {}
    for key, val of data
      if key not in attrNames
        continue
      if val instanceof Backbone.Model or val instanceof Backbone.Collection
        if typeof val is 'object' and val not in alreadyVisited
          alreadyVisited.push val
          result[key] _removePropertiesNotInDataclass val, dataClass, attrNames, alreadyVisited
      else
        result[key] = val
    result

  class ModelSerializer
    constructor: (@model) ->
      @dataClass = @model.dataClass
    changesToJSON: ->
      @toJSON @model.changedAttributes()
    allToJSON: ->
      @toJSON @model.attributes
    toJSON: (data) ->
      return null if not data
      json = @model.toJSON()
      # fullName
      #_removePropertiesNotInDataclass data, @dataClass
      data.__KEY = @model.id
      console.log @model.get '$stamp'
      data.__STAMP = @model.get '$stamp'
      JSON.stringify json
    fromJSON: (data) ->
      result = {}
      for key, value of data
        continue if key in _fieldsToRemove
        attr = @dataClass.attr key
        result[key] = attr.fromRaw value
      
      result.$stamp = data.__STAMP
      result.id = data.ID
      result