'use strict'
define ['wak-url-builder', 'backbone-walker', 'helpers', 'model-serializer', 'backbone'], (UrlBuilder, BackboneWalker, helpers, ModelSerializer)->
  
  _fieldsToRemove = ['__entityModel', '__KEY', '__STAMP', 'id', 'ID', 'uri']

  _createDef = (dataClass, catalog, dataloader) ->

    constructor: (options, collection) ->
      options.id ?= options.ID
      @_urlBuilder = new UrlBuilder @urlRoot + '(' + options.id + ')'
      @walker = new BackboneWalker @
      Backbone.Model::constructor.apply @, arguments
    dataClass: dataClass
    dataloader: dataloader
    catalog: catalog
    expand: (expanded...) ->
      @_expanded = @_urlBuilder.expand expanded
      @
    walk: (expression) -> 
      @walker.walk expression
    get: (expression) ->
      @walk(expression).val()
    set: (expression, value) ->
      if typeof expression is 'object'
        return Backbone.Model::set.apply @, arguments
      {model, property} = @walk expression
      Backbone.Model::set.call model, property, value
    parse: (response) ->
      serializer = new ModelSerializer @
      serializer.fromJSON response

    urlRoot: dataClass.dataURI
    url: -> @_urlBuilder.url
    sync: (method, model, options) ->
      def = $.Deferred()
      @dataloader[method](model, options)
        .done (data) ->
          options.success?(data, true)
          def.resolve()
      .fail (response) ->
        data = response.responseJSON
        errors = data?.__ERROR
        options.error?(data, errors)
        model.set '$errors', errors
        def.reject errors
      def.promise()

  create: (dataClass, catalog, dataloader) ->
    definition = _createDef dataClass, catalog, dataloader
    Model = Backbone.Model.extend(definition)
    Model.catalog = catalog
    Model.dataClass = dataClass
    Model