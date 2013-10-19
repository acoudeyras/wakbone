define ['backbone'], ->

  _createDef = (dataClass, catalog) ->

  create: (dataClass, catalog) ->
    definition = _createDef dataClass, catalog
    Model = Backbone.Model.extend(definition)
    Model.className = dataClass.className
    Model.definition= dataClass
    Model.catalog = catalog
    Model