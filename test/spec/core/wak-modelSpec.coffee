'use strict'
define ['chai', 'test-helpers'], ({expect, assert}, helpers) ->

  before (done) -> helpers.init @, done

  describe 'static properties', ->

    it 'should have a valid className', ->
      expect(@catalog.employee.Model.dataClass.className).to.equal 'Employee'
      expect(@catalog.company.Model.dataClass.className).to.equal 'Company'

    it 'should have a reference to the catalog', ->
      expect(@catalog.employee.Model.catalog).to.equal @catalog
      expect(@catalog.company.Model.catalog).to.equal @catalog

  #Shared behavior for 'loaded from collection' and 'loaded by itself'
  shouldBeAValidModel = ->

    expectedEmployee =
      birthDateYear: 1965
      firstName: 'VIRGINIA'
      companyName: 'Brendan Core Senior'

    expectedEmployee =
      birthDateYear: 1967
      firstName: 'MARIO'
      companyName: 'Pico Myaki Badge'

    it 'should have an id', ->
      expect(@emp.id).to.exist

    it 'should have a valid url', ->
      expect(@emp.url()).to.equal '/rest/Employee(' + @emp.id + ')'

    it 'should have loaded it\'s properties', ->
      expect(@emp.get 'firstName').to.equal expectedEmployee.firstName

    it 'should have a $stamp property', ->
      expect(@emp.get '$stamp').to.exist

    it 'should return related entities properties as collections', ->
      managedCompanies = @emp.get 'managedCompanies'
      expect(managedCompanies).to.be.an.instanceof Backbone.Collection

    it 'should have casted dates properties', ->
      date = @emp.get 'birthDate'
      expect(date.year()).to.equal expectedEmployee.birthDateYear

    describe 'relatedEntity', ->

      it 'should return related entity property as a Model', ->
        company = @emp.get 'company'
        expect(company).to.be.an.instanceof Backbone.Model

      it 'should be able to fetch that model', (done)->
        company = @emp.get 'company'
        company.fetch().done ->
          expect(company.get 'name').to.equal expectedEmployee.companyName
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
          expect(managedCompany.get 'name').to.equal expectedEmployee.companyName
          done()

    describe 'save', ->

      it 'should be able to update an employee for a basic type (string)', (done) ->
        gender = @emp.get 'gender'
        invertedGender = if gender is 'M' then 'F' else 'M'
        @emp.set 'gender', invertedGender
        @emp.save()
          .done =>
            expect(@emp.get 'gender').to.equal invertedGender
            done()
        .fail ->
          assert.fail() #TODO ?
          done()

      it 'should be able to update an employee for a type that need conversion (date)', (done) ->
        date = @emp.get 'birthDate'
        if date.month() is 2
          newDate = date.clone().set('month', 3)
        else
          newDate = date.clone().set('month', 2)
        @emp.set 'birthDate', newDate
        @emp.save()
          .done =>
            expectedDate = @emp.get 'birthDate'
            expect(expectedDate.month()).to.equal newDate.month()
            done()
        .fail ->
          helpers.testFail()
          done()

      describe 'handling errors', ->

        _isErrorInFirstName = (errors) ->
          expect(errors).to.have.length.above 0
          error = errors[0]
          expect(error.message).to.have.string 'String length'

        it 'should return an array of errors in the fail callback when an error happends on server', (done) ->
          @emp.set 'firstName', 'thisIsATooBigStringForTheFirstNameAttributeWayAboveItsMaxLength'
          @emp.save()
            .done =>
              helpers.testFail()
              done()
          .fail (errors)=>
            _isErrorInFirstName errors
            done()

        it 'should trigger the model error event', (done) ->
          @emp.set 'age', 'thisIsATooBigStringForTheFirstNameAttributeWayAboveItsMaxLength'
          @emp.once 'error', =>
            _isErrorInFirstName @emp.get('$errors')
            done()
          @emp.save()

      describe 'related model', ->

        it 'should be able to save a related model', ->
          #TODO

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
      employees.fetch(reset:true).done =>
        @emp = employees.get 1
        done()

    shouldBeAValidModel()

  describe 'url for new entity', ->

    it 'should be the urlRoot of the collection', ->
      emp = new @catalog.employee.Model()
      expect(emp.url()).to.equal '/rest/Employee'

  describe 'expand', ->

    it 'should load expanded data and load them as a model or collection', (done) ->
      
      Employee = @catalog.employee.Model
      emp = new Employee id: 1
      emp.expand('company', 'staff', 'managedCompanies').fetch().done =>
        company = emp.get 'company'
        expect(company).to.be.an.instanceof Backbone.Model
        expect(company.get 'name').to.equal 'Pico Myaki Badge'

        staff = emp.get 'staff'
        expect(staff).to.be.an.instanceof Backbone.Collection
        expect(staff).to.have.length 6
        done()


  describe 'get', ->

    before (done) ->
      Employee = @catalog.employee.Model
      emp = new Employee id: 1
      emp.expand('company', 'staff', 'managedCompanies').fetch().done =>
        @emp = emp
        @emp.get('staff').at(0).fetch('company').done ->
          done()

    it 'should support direct access to a related model', ->
      expectedCompanyName = @emp.get('company').get('name')
      expect(@emp.get 'company.name').to.equal expectedCompanyName

    it 'should throw an exception is the sub property is not a model or a collection', ->
      expect(=> @emp.get 'firstName.length').to.throw Error

    it 'should support direct access to a related collection', ->
      expectedCompanyName = @emp.get('staff').at(0).get('company').get('name')
      found = @emp.get 'staff[0].company.name'
      expect(found).to.equal expectedCompanyName

    it 'should throw an exception when the related model/collection is not fetched', ->
      expect(=> @emp.get 'staff[0].company.manager[0]').to.throw Error

  describe 'set', ->

    it 'should support direct set to a related model', ->
      @emp.set 'company.name', '4D'
      expect(@emp.get 'company.name').to.equal '4D'

    it 'should support direct set to a related model via a collection', ->
      @emp.set 'staff[0].company.name', '4D'
      expect(@emp.get 'staff[0].company.name').to.equal '4D'

  describe 'save for new entity (create)', ->

    it 'should work', (done) ->
      emp = new @catalog.employee.Model(firstName: 'Bob', lastName: 'Simon')
      emp.save().done ->
        expect(emp.get 'firstName').to.equal 'Bob'
        expect(emp.get 'lastName').to.equal 'Simon'
        expect(emp.get 'fullName').to.equal 'Bob Simon'
        expect(emp.id).to.exist
        done()

    it 'should to an update if we try to save it later', (done) ->
      emp = new @catalog.employee.Model(firstName: 'Bob', lastName: 'Simon')
      emp.save().done ->
        originalId = emp.id
        emp.set 'lastName', 'Roups'
        emp.save().done ->
          expect(emp.get 'firstName').to.equal 'Bob'
          expect(emp.get 'lastName').to.equal 'Roups'
          expect(emp.get 'fullName').to.equal 'Bob Roups'
          expect(emp.id).to.equal originalId
          done()

  describe 'deleting an entity', ->

    it 'should work', (done) ->
      emp = new @catalog.employee.Model(firstName: 'Bob', lastName: 'Simon')
      emp.save().done ->
        emp.destroy().done ->
          helpers.testSuccess()
          done()
        .fail ->
          helpers.testFail()
          done()

  describe 'saving with a related entity', ->

    it 'should work', (done) ->
      Employee = @catalog.employee.Model
      manager = new Employee(firstName: 'Bob', lastName: 'TheManager')
      manager.save().done ->
        emp = new Employee(firstName: 'Jim', lastName: 'TheGuy', manager: manager)
        emp.save().done ->
          helpers.testSuccess()
          done()
        .fail ->
          helpers.testFail()
          done()

    it 'should fail when the relatedEntity has not been saved', (done) ->
      Employee = @catalog.employee.Model
      manager = new Employee(firstName: 'Bob', lastName: 'TheManager')
      emp = new Employee(firstName: 'Jim', lastName: 'TheGuy', manager: manager)
      emp.save().done ->
        helpers.testFail()
        done()
      .fail ->
        helpers.testSuccess()
        done()

