'use strict'
define ['./wak-model', './wak-collection', './attribute', './http-requester', './helpers', './check', 'backbone'], (wakModelFactory, wakCollectionFactory, Attribute, HttpRequester, helpers, check) ->
      
  class DataClass
    constructor: ({@className, @collectionName, @dataURI, attributes}, @catalog) ->
      @_attributes = attributes.map (attr) => new Attribute(attr, @)
      @_attributesByName = _.indexBy @_attributes, 'name'
    finalize: (@Collection, @Model) ->
      @entities = new @Collection()
    attr: (name) ->
      return @_attributes if not name?
      @_attributesByName[name]

  class Catalog
    constructor: (data) ->
      @$classNames = []
      @$dataLoader = new HttpRequester()
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
      dataClass = new DataClass rawDataClass, @
      Model = wakModelFactory.create dataClass, @, @$dataLoader
      Collection = wakCollectionFactory.create dataClass, Model, @
      dataClass.finalize Collection, Model
      @[entryName] = dataClass
    @classNameInCatalog: (className) -> _.lowerCamelize className
    @load: (success) ->
      $.ajax('/rest/$catalog/$all')
        .then (data) -> new Catalog data
