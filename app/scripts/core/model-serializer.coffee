define ['backbone'], ->

  _fieldsToRemove = ['__entityModel', '__KEY', '__STAMP', 'id', 'ID', 'uri']

  class ModelSerializer
    constructor: (@model) ->
      @dataClass = @model.dataClass
    toJSON: ->
      data = @model.attributes
      return null if not data
      json = @model.toJSON()
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