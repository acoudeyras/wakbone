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

    before (done) ->
      @employees = @catalog.employee.entities
      @employees.fetch(reset:true).done ->
        done()

    it 'should load data', ->
      expect(@employees).not.to.be.empty

    it 'should load data as a Backbone Model', ->
      emp = @employees.at 0
      expect(emp).to.be.an.instanceof Backbone.Model

    it 'should be able to retrieve models by id', ->
      emp = @employees.get 3
      expect(emp).to.exist

  describe '$state', ->

    describe 'limit', ->

      it 'should add a $limit parameter in url if setted', (done)->
        @employees.$state.limit(10)
        @employees.fetch(reset:true).done ->
          expect(col.length).to.have.length 10
          done()