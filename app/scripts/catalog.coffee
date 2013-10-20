'use strict'
define ['./wak-model', './wak-collection', './types', './helpers', './check','backbone'], (wakModelFactory, wakCollectionFactory, types, helpers, check) ->
      
  class Attribute
    constructor: ({@identifying, @indexed, @kind, @name, @scope, @type, @path}, @dataClass) ->
      @identifying ?= false
      @isRaw = @kind in Attribute.rawKinds
      @catalog = @dataClass.catalog
      if @isRaw
        @extendedType = types[@type]
        if not @extendedType?
          throw new Error ('type ' + @type + ' not supported')
      ###
      need to be lazy, because when we load the attributes, the catalog may not have yet loaded
      the relatedModel. We could have added a "build" method that would have done that and be called
      by the catalog after all model are loaded, but i thought it was overdesign yet
      ###
    @lazyval 'RelatedModel', ->
      name = Catalog.classNameInCatalog @type
      @catalog[name].Model if @kind is 'relatedEntity'
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
      id = value.__deferred.__KEY #TODO handle already loaded
      new @RelatedCollection()
    fromRaw: (value) ->
      return @extendedType.fromRaw value if @isRaw
      return @_convertToRelatedModel value if @kind is 'relatedEntity'
      return @_convertToRelatedCollection value if @kind is 'relatedEntities'
      console.log 'oups'
    toRaw: (value) ->
    @rawKinds: ['storage', 'alias', 'calculated']


  class DataClass
    constructor: ({@className, @collectionName, @dataURI, attributes}, @catalog) ->
      @attributes = attributes.map (attr) => new Attribute(attr, @)
      @attributesByName = _.indexBy @attributes, 'name'


  class Catalog
    constructor: (data) ->
      #dataClasses = data.dataClasses.map (dataClass) => new DataClass(dataClass, @)
      @$classNames = []
      @_colsByEntryName = {}
      for rawDataClass in data.dataClasses
        entryName = Catalog.classNameInCatalog rawDataClass.className
        @$classNames.push entryName
        helpers.throwIf @[entryName]?, "conflict in catalog with dataclass #{entryName}"
        @_colsByEntryName[rawDataClass.collectionName] = entryName
        @_addEntry entryName, rawDataClass
    $entryFromCollectionName: (collectionName) ->
      entryName = @_colsByEntryName[collectionName]
      @[entryName]
    _addEntry: (entryName, rawDataClass) ->
      def = new DataClass(rawDataClass, @)
      Model = wakModelFactory.create def, @
      Collection = wakCollectionFactory.create def, Model, @
      @[entryName] =
        def: def
        Model: Model
        Collection: Collection
        entities: new Collection()
    @classNameInCatalog: (className) -> _.lowerCamelize className
    @load: (success) ->
      $.ajax('/rest/$catalog/$all')
        .then (data) -> new Catalog data
