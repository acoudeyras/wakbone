'use strict'
define ['wak-collection', 'chai', 'test-helpers'], (WakCollection, {expect}, helpers) ->

  before (done) -> helpers.init @, done

  describe 'class', ->

    it 'should have an url', ->
      expect(@catalog.employee.entities.url()).to.equal '/rest/Employee'

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

  describe 'query', ->

    after -> @employees.query.clear()

    describe 'limit', ->

      it 'should restrict the number of entities returned', (done)->
        @employees.query.limit 5
        @employees.fetch(reset:true).done =>
          expect(@employees).to.have.length 5
          done()

    describe 'skip', ->

      it 'should skip a number of entitites', (done)->
        @employees.query.limit 5
        @employees.fetch(reset:true).done =>
          expectedFirstName = @employees.at(2).get('firstName')

          @employees.query.clear()
          @employees.query.skip 2
          @employees.query.limit 5

          @employees.fetch(reset:true).done =>
            expect(@employees).to.have.length 5
            expect(@employees.at(0).get('firstName')).to.equal expectedFirstName
            done()

    describe 'orderby', ->

      it 'should accept a string with one orderby', (done) ->
        @employees.query
          .orderBy('firstName')
          .limit(5)
        @employees.fetch(reset:true).done =>
          found = @employees.at(0).get('firstName')
          expect(found).to.be.null
          done()

      it 'should accept a string with multiple orderbys', (done) ->
          @employees.query
            .orderBy('gender DESC, firstName DESC')
            .limit(5)
          @employees.fetch(reset:true).done =>
            found = @employees.at(0).get('firstName')
            expect(found).to.equal 'ZACKARY'
            done()



