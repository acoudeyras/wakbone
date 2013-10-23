define ['./wak-url-builder', './backbone-walker', './helpers', './model-serializer', 'backbone'], (UrlBuilder, BackboneWalker, helpers, ModelSerializer)->
  
  _fieldsToRemove = ['__entityModel', '__KEY', '__STAMP', 'id', 'ID', 'uri']

  _createDef = (dataClass, catalog, dataloader) ->

    constructor: (options, collection) ->
      options ?= {}
      options.id ?= options.ID
      @_urlBuilder = new UrlBuilder @urlRoot
      if options.id?
        @_urlBuilder.key options.id
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
        if expression.id?
          @_urlBuilder.key expression.id
        return Backbone.Model::set.apply @, arguments

      if expression is 'id'
        @_urlBuilder.key value
      {model, property} = @walk expression
      Backbone.Model::set.call model, property, value
    toJSON: ->
      _addToResultIfExist = (propName, key) =>
        val = @.get propName
        if val?
          result[key] = val

      result = {}
      attrNames = _.pluck dataClass.attr(), 'name'
      for key, value of @attributes #WTF !!!
        if key not in attrNames
          continue
        attr = dataClass.attr key
        if attr.readOnly
          continue
        if not value?
          result[key] = null
          continue
        if value instanceof Backbone.Collection
          continue
        if value instanceof Backbone.Model
          if value.isNew()
            throw new Error('You must first save a entity before making it related to another')
          result[key] = {
            __KEY: value.get('id')
          }
          continue
        if typeof value.toJSON is 'function'
          value = value.toJSON()
          if value isnt undefined #undefined = not in json (used by collection not fetched)
            result[key] = value
          continue
        result[key] = value
      _addToResultIfExist '$stamp', '__STAMP'
      _addToResultIfExist 'id', '__KEY'
      result
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