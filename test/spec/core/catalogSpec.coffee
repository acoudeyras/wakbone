'use strict'
define ['core/catalog', 'chai', 'test-helpers'], (Catalog, {expect}, helpers)->

  before (done) -> helpers.init @, done

  describe 'load', ->

    it 'should load catalog', (done) ->
      Catalog.load().done (catalog) ->
        expect(catalog).not.to.be.null
        done()

  describe '$classNames', ->

    it 'should contains all dataclasses', ->
      expect(@catalog.$classNames).to.have.length 4

  describe 'dataClasses (stored as properties)', ->

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
        def = @catalog[className]
        expect(def).to.exist

    describe 'Collection', ->

      it 'should be a function (constructor)', ->
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
      @empClass = @catalog.employee

    it 'should have a className', ->
      expect(@empClass.className).to.equal 'Employee'

    it 'should have a collectionName', ->
      expect(@empClass.collectionName).to.equal 'Employees'

    it 'should have a dataURI', ->
      expect(@empClass.dataURI).to.equal '/rest/Employee'

    describe 'attr', ->

      it 'should return all attributes when call without parameter', ->
        expect(@empClass.attr()).to.have.length 15

      it 'should return the corresponding attribute when a parameter is specified', ->
        for attr in @empClass.attr()
          expect(@empClass.attr(attr.name)).to.exist



