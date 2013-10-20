'use strict'
define ['backbone'], ->

  _createDef = (dataClass, catalog) ->
    constructor: (options) ->
      @id = options.ID
      Backbone.Model::constructor.apply @, arguments
    #attr: (name) -> _.find @$def.attributes, (attr) -> attr.name is name
    url: -> @urlRoot + '(' + @id + ')'

  create: (dataClass, catalog) ->
    definition = _createDef dataClass, catalog
    Model = Backbone.Model.extend(definition)
    Model.className = dataClass.className
    Model.catalog = catalog
    Model