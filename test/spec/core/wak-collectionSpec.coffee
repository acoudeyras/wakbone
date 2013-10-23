define ['core/wak-collection', 'chai', 'test-helpers'], (WakCollection, {expect}, helpers) ->

  before (done) -> helpers.init @, done

  describe 'class', ->

    it 'should have an url', ->
      expect(@catalog.employee.entities.url()).to.equal '/rest/Employee'

    it 'should have a className', ->
      expect(@catalog.employee.entities.dataClass.className).to.equal 'Employee'

    it 'should have a collectionName', ->
      expect(@catalog.employee.entities.dataClass.collectionName).to.equal 'Employees'

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

    afterEach -> @employees.query.clear()

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
          expect(found).to.equal 'ZANE'
          done()

    describe 'expand', ->

      it 'should accept single expand on a related entity, fetch corresponding data and load it as a model', (done) ->
        @employees.query
          .expand('company')
          .limit(5)
        @employees.fetch(reset:true).done =>
          company = @employees.at(0).get('company')
          expect(company).to.be.an.instanceof Backbone.Model
          expect(company.get 'name').to.equal 'Pico Myaki Badge'
          done()

      it 'should accept multiple expand on related entities, fetch corresponding data and load it as a collection', (done) ->
        @employees.query
          .expand('managedCompanies', 'staff')
          .skip(5)
          .limit(10)
        @employees.fetch(reset:true).done =>
          staff = @employees.at(2).get('staff')
          expect(staff).to.be.an.instanceof Backbone.Collection
          expect(staff).to.have.length 6
          emp = staff.at 0
          expect(emp.get 'firstName').to.equal 'JUDY'
          done()

    describe 'select', ->

      it 'should fetch only selected property', (done) ->
        @employees.query
          .select('firstName')
          .limit(5)
        @employees.fetch(reset:true).done =>
          emp = @employees.at 0
          expect(emp.get 'firstName').to.exist
          expect(emp.get 'lastName').not.to.exist
          done()

      it 'should fetch only selected properties', (done) ->
        @employees.query
          .select('firstName', 'lastName')
          .limit(5)
        @employees.fetch(reset:true).done =>
          emp = @employees.at 0
          expect(emp.get 'firstName').to.exist
          expect(emp.get 'lastName').to.exist
          expect(emp.get 'age').not.to.exist
          done()

      it 'should expand related entity if selected property need expand', (done) ->
        @employees.query
          .select('company.name', 'lastName')
          .limit(5)
        @employees.fetch(reset:true).done =>
          emp = @employees.at 0
          expect(emp.get 'lastName').to.exist
          expect(emp.get 'age').not.to.exist
          expect(emp.get 'company.name').to.exist
          done()

      it 'should expand related entities if selected property need expand', (done) ->
        @employees.query
          .select('company.name', 'staff.lastName')
          .limit(5)
        @employees.fetch(reset:true).done =>
          emp = @employees.at 0
          expect(emp.get 'company.name').to.exist
          expect(emp.get 'staff[0].lastName').to.exist
          expect(emp.get 'staff[0].age').not.to.exist
          done()

    describe 'filter', ->

      it 'should accept and filter with a simple filter string', (done) ->
        @employees.query
          .where('firstName begin a')
          .orderBy(firstName: -1)
          .limit(5)
        @employees.fetch(reset:true).done =>
          emp = @employees.at 0
          firstName = emp.get 'firstName'
          expect(firstName[0]).to.equal 'A'
          done()

      it 'should accept and filter with a complex filter string', (done) ->
        @employees.query
          .where('firstName begin a and age = 32')
          .orderBy(firstName: -1)
          .limit(5)
        @employees.fetch(reset:true).done =>
          emp = @employees.at 0
          firstName = emp.get 'firstName'
          expect(firstName).to.equal 'AVIS'
          done()
