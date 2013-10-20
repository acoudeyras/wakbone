'use strict'
define ['./wak-model', './wak-collection', './attribute', './helpers', './check','backbone'], (wakModelFactory, wakCollectionFactory, Attribute, helpers, check) ->
      
  class DataClass
    constructor: ({@className, @collectionName, @dataURI, attributes}, @catalog) ->
      @_attributes = attributes.map (attr) => new Attribute(attr, @)
      @_attributesByName = _.indexBy @_attributes, 'name'
    attr: (name) ->
      return @_attributes if not name?
      @_attributesByName[name]

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
