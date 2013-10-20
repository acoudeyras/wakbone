'use strict'
define ['catalog', 'chai', 'test-helpers'], (Catalog, {expect}, helpers) ->

  before (done) -> helpers.init done

  describe 'static properties', ->

    it 'should have a valid className', ->
      expect(helpers.catalog.models.Employee.className).to.equal 'Employee'
      expect(helpers.catalog.models.Company.className).to.equal 'Company'

    it 'should have a reference to the catalog', ->
      expect(helpers.catalog.models.Employee.catalog).to.equal helpers.catalog
      expect(helpers.catalog.models.Company.catalog).to.equal helpers.catalog

  describe 'loading from collection', ->

    loadModel = ->
      employees = helpers.catalog.collections.Employees
      employees.fetch().then -> employees.at(0)

    it 'should have an id', (done) ->
      loadModel().done (model) ->
        expect(model.id).to.exist
        done()


    xit 'should have a reference to its metadata', ->
      #TODO definition voir si utile et besoin d'abstraction

