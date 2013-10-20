'use strict'
define ['./types', './helpers'], (types, helpers) ->

  class Attribute
    constructor: ({@identifying, @indexed, @kind, @name, @scope, @type, @path}, @dataClass) ->
      @identifying ?= false
      @isRaw = @kind in Attribute.rawKinds
      @catalog = @dataClass.catalog
      if @isRaw
        @typeExtra = types[@type]
        if not @typeExtra?
          throw new Error ('type ' + @type + ' not supported')
      ###
      need to be lazy, because when we load the attributes, the catalog may not have yet loaded
      the relatedModel. We could have added a "build" method that would have done that and be called
      by the catalog after all model are loaded, but i thought it was overdesign yet
      ###
    @lazyval 'RelatedModel', ->
      return null if @kind isnt 'relatedEntity'
      name = @catalog.constructor.classNameInCatalog @type
      @catalog[name].Model
    @lazyval 'RelatedCollection', ->
      return null if @kind isnt 'relatedEntities'
      dataClass = @catalog.$entryFromCollectionName @type
      dataClass.Collection
    _convertToRelatedModel: (value) ->
      return null if value is null
      id = value.__deferred.__KEY #TODO handle already loaded
      new @RelatedModel(id: id)
    _convertToRelatedCollection: (value) ->
      return null if value is null
      url = value.__deferred.uri #TODO handle already loaded
      newCollection = @RelatedCollection.extend(url: url)
      new newCollection()
    fromRaw: (value) ->
      return @typeExtra.fromRaw value if @typeExtra?
      return @_convertToRelatedModel value if @kind is 'relatedEntity'
      return @_convertToRelatedCollection value if @kind is 'relatedEntities'
      console.log 'oups'
    toRaw: (value) ->
    @rawKinds: ['storage', 'alias', 'calculated']