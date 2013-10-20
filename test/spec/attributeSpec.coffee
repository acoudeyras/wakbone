'use strict'
define ['chai', 'test-helpers'], ({expect}, helpers)->

  before (done) -> helpers.init @, done

  describe 'Attribute', ->

    before ->
      @empClass = @catalog.employee.def
      @firstNameAttr = @empClass.attr('firstName')

    it 'should have a name', ->
      expect(@firstNameAttr.name).to.equal 'firstName'

    it 'should have a type', ->
      expect(@firstNameAttr.type).to.equal 'string'

    it 'should have an indexed property', ->
      expect(@firstNameAttr.indexed).to.be.true

    it 'should have an identifying property', ->
      expect(@firstNameAttr.identifying).to.be.false
      id = @empClass.attr('ID')
      expect(id.identifying).to.be.true

    it 'should have a kind', ->
      expect(@firstNameAttr.kind).to.equal 'storage'

    it 'should have a dataClass', ->
      expect(@firstNameAttr.dataClass).to.equal @empClass

    it 'should have a catalog', ->
      expect(@firstNameAttr.catalog).to.equal @catalog

    describe 'isRaw', ->

      it 'should be true for storage, calculated and alias kind', ->
        for attr in @empClass.attr()
          expectedIsRaw = attr.kind in ['storage', 'calculated', 'alias']
          expect(attr.isRaw).to.equal expectedIsRaw

    describe 'RelatedModel', ->

      it 'should return null if the attribute is not a related model', ->
        expect(@firstNameAttr.RelatedModel).to.be.null
        expect(@empClass.attr('managedCompanies').RelatedModel).to.be.null

      it 'should return the related Model if the attribute is a related model', ->
        attr = @empClass.attr('company')
        expect(attr.RelatedModel).to.exist
        expect(attr.RelatedModel).to.equal @catalog.company.Model

    describe 'RelatedCollection', ->

      it 'should return null if the attribute is not a related collection', ->
        expect(@firstNameAttr.RelatedCollection).to.be.null
        expect(@empClass.attr('company').RelatedCollection).to.be.null

      it 'should return the related Collection if the attribute is a related collection', ->
        attr = @empClass.attr('managedCompanies')
        expect(attr.RelatedCollection).to.exist
        expect(attr.RelatedCollection).to.equal @catalog.company.Collection

    describe 'fromRaw', ->

      _expectFromRaw = (context, attrName, rawValue, expectedValue=rawValue) ->
        attr = context.empClass.attr attrName
        convertedValue = attr.fromRaw rawValue
        expect(convertedValue).to.equal expectedValue

      it 'should return the same value when the type is string, number and long', ->
        _expectFromRaw @, 'firstName', 'alexis'
        _expectFromRaw @, 'age', 20
        _expectFromRaw @, 'ID', 20

      it 'should return a valid Date object when the type is date', ->
        attr = @empClass.attr 'birthDate'
        converted = attr.fromRaw '24!8!1954'
        expect(converted.year()).to.equal 1954
        expect(converted.month()).to.equal 7
        expect(converted.date()).to.equal 24

      describe 'with related model', ->

        _rawCompany =
          __deferred:
            uri: '/rest/Company(8)'
            __KEY: '8'

        it 'should return an instance of the related model when the kind is a relatedEntity', ->
          attr = @empClass.attr 'company'
          model = attr.fromRaw _rawCompany
          expect(model).to.be.an.instanceof @catalog.company.Model

        it 'should return a related model with a correct id', ->
          attr = @empClass.attr 'company'
          model = attr.fromRaw _rawCompany
          expect(model.id).to.equal _rawCompany.__deferred.__KEY

        it 'should return null if the rawValue has a null value', ->
          attr = @empClass.attr 'company'
          model = attr.fromRaw null
          expect(model).to.be.null

      describe 'with related collection', ->

        _rawManagedCompanies =
          __deferred:
            uri: '/rest/Employee(100)/managedCompanies?$expand=managedCompanies'

        it 'should return an instance of the related collection when the kind is a relatedEntities', ->
          attr = @empClass.attr 'managedCompanies'
          collection = attr.fromRaw _rawManagedCompanies
          expect(collection).to.be.an.instanceof @catalog.company.Collection

        it 'should return a related collection with a correct url by adding the subentity method', ->
          attr = @empClass.attr 'managedCompanies'
          collection = attr.fromRaw _rawManagedCompanies
          expect(collection.url).to.equal _rawManagedCompanies.__deferred.uri + '&$method=subentityset'

        it 'should return null if the rawValue has a null value', ->
          attr = @empClass.attr 'managedCompanies'
          collection = attr.fromRaw null
          expect(collection).to.be.null


