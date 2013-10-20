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

    it 'should return related entities properties as collections', ->
      managedCompanies = @emp.get 'managedCompanies'
      expect(managedCompanies).to.be.an.instanceof Backbone.Collection

    it 'should have casted dates properties', ->
      date = @emp.get 'birthDate'
      expect(date.year()).to.equal 1967

    describe 'relatedEntity', ->

      it 'should return related entity property as a Model', ->
        company = @emp.get 'company'
        expect(company).to.be.an.instanceof Backbone.Model

      it 'should be able to fetch that model', (done)->
        company = @emp.get 'company'
        company.fetch().done ->
          expect(company.get 'name').to.equal 'Pico Myaki Badge'
          done()

    describe 'relatedEntities', ->

      it 'should return related entities property as a Collection', ->
        managedCompanies = @emp.get 'managedCompanies'
        expect(managedCompanies).to.be.an.instanceof Backbone.Collection

      it 'should be able to fetch that collection', (done)->
        managedCompanies = @emp.get 'managedCompanies'
        managedCompanies.fetch().done ->
          expect(managedCompanies).to.have.length 1
          managedCompany = managedCompanies.at 0
          expect(managedCompany.get('name')).to.equal 'Pico Myaki Badge'
          done()

    describe 'save', ->

      it 'should be able to update an employee', (done) ->
        gender = @emp.get('gender')
        invertedGender = if gender is 'M' then 'F' else 'M'
        @emp.set('gender', invertedGender)
        @emp.save()
          .done =>
            expect(@emp.get 'gender').to.equal invertedGender
            done()
          .fail =>
            expect(true).to.be.false #TODO ?
            done()

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
      employees.fetch(reset: true).done =>
        @emp = employees.get 1
        done()

    shouldBeAValidModel()

    xit 'should have a reference to its metadata', ->
      #TODO definition voir si utile et besoin d'abstraction

