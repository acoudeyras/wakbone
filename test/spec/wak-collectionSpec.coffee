'use strict'
define ['wak-collection', 'chai', 'test-helpers'], (WakCollection, {expect}, helpers) ->

  before (done) -> helpers.init @, done

  describe 'class', ->

    it 'should have an url', ->
      expect(@catalog.employee.entities.url).to.equal '/rest/Employee'

    it 'should have a className', ->
      expect(@catalog.employee.entities.className).to.equal 'Employee'

    it 'should have a collectionName', ->
      expect(@catalog.employee.entities.collectionName).to.equal 'Employees'

  describe 'fetch', ->

    it 'should load data', (done) ->
      employees = @catalog.employee.entities
      employees.fetch().done () ->
        expect(employees).not.to.be.empty
        done()

    it 'should load data as a Backbone Model', (done) ->
      employees = @catalog.employee.entities
      employees.fetch().done () ->
        emp = employees.at(0)
        expect(emp).to.be.an.instanceof Backbone.Model
        done()
