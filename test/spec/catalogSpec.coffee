'use strict'
define ['catalog', 'chai', 'test-helpers'], (Catalog, {expect}, helpers)->

  before (done) -> helpers.init done

  describe 'load', ->

    it 'should load catalog', (done) ->
      Catalog.load().done (catalog) ->
        expect(catalog).not.to.be.null
        done()

  describe 'models', ->

    it 'should contains all models', ->
      modelNames = Object.keys helpers.catalog.models
      expect(modelNames.length).to.equal 4

    it 'should have models indexed by className', ->
      expect(helpers.catalog.models.Employee).to.exist
      expect(helpers.catalog.models.Company).to.exist

    it 'should contains all collections (same number as models)', ->
      modelNames = Object.keys helpers.catalog.models
      collectionNames = Object.keys helpers.catalog.collections
      expect(modelNames.length).to.equal collectionNames.length

    it 'should have collections indexed by collectionName', ->
      expect(helpers.catalog.collections.Employees).to.exist
      expect(helpers.catalog.collections.Companies).to.exist