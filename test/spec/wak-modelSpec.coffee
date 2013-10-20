'use strict'
define ['catalog', 'chai', 'test-helpers'], (Catalog, {expect}, helpers) ->

  before (done) -> helpers.init @, done

  describe 'static properties', ->

    it 'should have a valid className', ->
      expect(@catalog.employee.Model.className).to.equal 'Employee'
      expect(@catalog.company.Model.className).to.equal 'Company'

    it 'should have a reference to the catalog', ->
      expect(@catalog.employee.Model.catalog).to.equal @catalog
      expect(@catalog.company.Model.catalog).to.equal @catalog

  #Shared behavior for 'loaded from collection' and 'loaded by itself'
  shouldBeAValidModel = ->
    it 'should have an id', ->
      expect(@emp.id).to.exist

    it 'should have a valid url', ->
      expect(@emp.url()).to.equal '/rest/Employee(' + @emp.id + ')'

    it 'should have loaded it\'s properties', ->
      expect(@emp.get('firstName')).to.equal 'MARIO'

    it 'should have a $stamp property', ->
      expect(@emp.get('$stamp')).to.exist

    it 'should return related entity properties as model', ->
      company = @emp.get 'company'
      expect(company).to.be.an.instanceof Backbone.Model

    it 'should return related entities properties as collections', ->
      managedCompanies = @emp.get 'managedCompanies'
      expect(managedCompanies).to.be.an.instanceof Backbone.Collection

    xit 'should have casted dates properties', ->





  describe 'loading by itself', ->

    before (done) ->
      Employee = @catalog.employee.Model
      emp = new Employee id: 1
      emp.fetch().done =>
        @emp = emp
        done()

    shouldBeAValidModel()

  describe 'loading from collection', ->

    before (done) ->
      employees = @catalog.employee.entities
      employees.fetch().done =>
        @emp = employees.at 0
        done()

    shouldBeAValidModel()

    xit 'should have a reference to its metadata', ->
      #TODO definition voir si utile et besoin d'abstraction

