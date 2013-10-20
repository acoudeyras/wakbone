'use strict'
define ['wak-collection', 'chai', 'test-helpers'], (WakCollection, {expect}, helpers) ->

  before (done) -> helpers.init done

  describe 'class', ->

    it 'should have an url', ->
      expect(helpers.catalog.collections.Employees.url).to.equal '/rest/Employee'

    it 'should have a className', ->
      expect(helpers.catalog.collections.Employees.className).to.equal 'Employee'

    it 'should have a collectionName', ->
      expect(helpers.catalog.collections.Employees.collectionName).to.equal 'Employees'

  describe 'fetch', ->

    it 'should load data', (done) ->
      employees = helpers.catalog.collections.Employees
      employees.fetch().done () ->
        expect(employees).not.to.be.empty
        done()

    it 'should load data as a Backbone Model', (done) ->
      employees = helpers.catalog.collections.Employees
      employees.fetch().done () ->
        emp = employees.at(0)
        expect(emp).to.be.an.instanceof Backbone.Model
        done()
