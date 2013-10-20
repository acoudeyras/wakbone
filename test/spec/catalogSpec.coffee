'use strict'
define ['catalog', 'chai', 'test-helpers'], (Catalog, {expect}, helpers)->

  before (done) -> helpers.init @, done

  describe 'load', ->

    it 'should load catalog', (done) ->
      Catalog.load().done (catalog) ->
        expect(catalog).not.to.be.null
        done()

  describe '$classNames', ->

    it 'should contains all dataclasses', ->
      expect(@catalog.$classNames).to.have.length 4

  describe 'dataClasses (stored as properties', ->

    it 'should contains all dataclasses', ->
      for className in @catalog.$classNames
        expect(@catalog[className]).to.exist

  describe 'dataClass', ->

    it 'should contains Model', ->
      for className in @catalog.$classNames
        Model = @catalog[className].Model
        expect(Model).to.exist
        expect(Model).to.be.a.function

    it 'should contains Collection', ->
      for className in @catalog.$classNames
        Collection = @catalog[className].Collection
        expect(Collection).to.exist

    it 'should contains entities collection', ->
      for className in @catalog.$classNames
        entities = @catalog[className].entities
        expect(entities).to.exist

    it 'should contains the dataClass itself', ->
      for className in @catalog.$classNames
        def = @catalog[className].def
        expect(def).to.exist

    describe 'Collection', ->

      it 'should be a class', ->
        for className in @catalog.$classNames
          Collection = @catalog[className].Collection
          expect(Collection).to.be.a.function

    describe 'entities', ->

      it 'should be an instanceof Backbone.Collection and their own Collection class', ->
        for className in @catalog.$classNames
          entities = @catalog[className].entities
          expect(entities).to.be.an.instanceof Backbone.Collection
          expect(entities).to.be.an.instanceof @catalog[className].Collection

  describe 'DataClass', ->

    before ->
      @empClass = @catalog.employee.def

    it 'should have a className', ->
      expect(@empClass.className).to.equal 'Employee'

    it 'should have a collectionName', ->
      expect(@empClass.collectionName).to.equal 'Employees'

    it 'should have a dataURI', ->
      expect(@empClass.dataURI).to.equal '/rest/Employee'

    it 'should have attributes', ->
      expect(@empClass.attributes).to.have.length 15

    it 'should have attributes indexed by name in attributesByName', ->
      attrNames = Object.keys @empClass.attributesByName
      expect(attrNames).to.have.length @empClass.attributes.length
      for attr in @empClass.attributes
        expect(@empClass.attributesByName).to.have.a.property attr.name

    describe 'Attribute', ->

      before ->
        @firstNameAttr = @empClass.attributesByName['firstName']

      it 'should have a name', ->
        expect(@firstNameAttr.name).to.equal 'firstName'

      it 'should have a type', ->
        expect(@firstNameAttr.type).to.equal 'string'

      it 'should have an indexed property', ->
        expect(@firstNameAttr.indexed).to.equal true

      it 'should have an identifying property', ->
        expect(@firstNameAttr.identifying).to.equal false
        id = @empClass.attributesByName['ID']
        expect(id.identifying).to.equal true

      it 'should have a kind', ->
        expect(@firstNameAttr.kind).to.equal 'storage'

      it 'should have a dataClass', ->
        expect(@firstNameAttr.dataClass).to.equal @empClass

      it 'should have a catalog', ->
        expect(@firstNameAttr.catalog).to.equal @catalog

      describe 'isRaw', ->

        it 'should be true for storage type', ->




