(function() {
  define(['core/wak-collection', 'chai', 'test-helpers'], function(WakCollection, _arg, helpers) {
    var expect;
    expect = _arg.expect;
    before(function(done) {
      return helpers.init(this, done);
    });
    describe('class', function() {
      it('should have an url', function() {
        return expect(this.catalog.employee.entities.url()).to.equal('/rest/Employee');
      });
      it('should have a className', function() {
        return expect(this.catalog.employee.entities.dataClass.className).to.equal('Employee');
      });
      return it('should have a collectionName', function() {
        return expect(this.catalog.employee.entities.dataClass.collectionName).to.equal('Employees');
      });
    });
    describe('fetch', function() {
      before(function(done) {
        this.employees = this.catalog.employee.entities;
        return this.employees.fetch({
          reset: true
        }).done(function() {
          return done();
        });
      });
      it('should load data', function() {
        return expect(this.employees).not.to.be.empty;
      });
      it('should load data as a Backbone Model', function() {
        var emp;
        emp = this.employees.at(0);
        return expect(emp).to.be.an["instanceof"](Backbone.Model);
      });
      return it('should be able to retrieve models by id', function() {
        var emp;
        emp = this.employees.get(3);
        return expect(emp).to.exist;
      });
    });
    return describe('query', function() {
      afterEach(function() {
        return this.employees.query.clear();
      });
      describe('limit', function() {
        return it('should restrict the number of entities returned', function(done) {
          var _this = this;
          this.employees.query.limit(5);
          return this.employees.fetch({
            reset: true
          }).done(function() {
            expect(_this.employees).to.have.length(5);
            return done();
          });
        });
      });
      describe('skip', function() {
        return it('should skip a number of entitites', function(done) {
          var _this = this;
          this.employees.query.limit(5);
          return this.employees.fetch({
            reset: true
          }).done(function() {
            var expectedFirstName;
            expectedFirstName = _this.employees.at(2).get('firstName');
            _this.employees.query.clear();
            _this.employees.query.skip(2);
            _this.employees.query.limit(5);
            return _this.employees.fetch({
              reset: true
            }).done(function() {
              expect(_this.employees).to.have.length(5);
              expect(_this.employees.at(0).get('firstName')).to.equal(expectedFirstName);
              return done();
            });
          });
        });
      });
      describe('orderby', function() {
        it('should accept a string with one orderby', function(done) {
          var _this = this;
          this.employees.query.orderBy('firstName').limit(5);
          return this.employees.fetch({
            reset: true
          }).done(function() {
            var found;
            found = _this.employees.at(0).get('firstName');
            expect(found).to.be["null"];
            return done();
          });
        });
        return it('should accept a string with multiple orderbys', function(done) {
          var _this = this;
          this.employees.query.orderBy('gender DESC, firstName DESC').limit(5);
          return this.employees.fetch({
            reset: true
          }).done(function() {
            var found;
            found = _this.employees.at(0).get('firstName');
            expect(found).to.equal('ZANE');
            return done();
          });
        });
      });
      describe('expand', function() {
        it('should accept single expand on a related entity, fetch corresponding data and load it as a model', function(done) {
          var _this = this;
          this.employees.query.expand('company').limit(5);
          return this.employees.fetch({
            reset: true
          }).done(function() {
            var company;
            company = _this.employees.at(0).get('company');
            expect(company).to.be.an["instanceof"](Backbone.Model);
            expect(company.get('name')).to.equal('Pico Myaki Badge');
            return done();
          });
        });
        return it('should accept multiple expand on related entities, fetch corresponding data and load it as a collection', function(done) {
          var _this = this;
          this.employees.query.expand('managedCompanies', 'staff').skip(5).limit(10);
          return this.employees.fetch({
            reset: true
          }).done(function() {
            var emp, staff;
            staff = _this.employees.at(2).get('staff');
            expect(staff).to.be.an["instanceof"](Backbone.Collection);
            expect(staff).to.have.length(6);
            emp = staff.at(0);
            expect(emp.get('firstName')).to.equal('JUDY');
            return done();
          });
        });
      });
      describe('select', function() {
        it('should fetch only selected property', function(done) {
          var _this = this;
          this.employees.query.select('firstName').limit(5);
          return this.employees.fetch({
            reset: true
          }).done(function() {
            var emp;
            emp = _this.employees.at(0);
            expect(emp.get('firstName')).to.exist;
            expect(emp.get('lastName')).not.to.exist;
            return done();
          });
        });
        it('should fetch only selected properties', function(done) {
          var _this = this;
          this.employees.query.select('firstName', 'lastName').limit(5);
          return this.employees.fetch({
            reset: true
          }).done(function() {
            var emp;
            emp = _this.employees.at(0);
            expect(emp.get('firstName')).to.exist;
            expect(emp.get('lastName')).to.exist;
            expect(emp.get('age')).not.to.exist;
            return done();
          });
        });
        it('should expand related entity if selected property need expand', function(done) {
          var _this = this;
          this.employees.query.select('company.name', 'lastName').limit(5);
          return this.employees.fetch({
            reset: true
          }).done(function() {
            var emp;
            emp = _this.employees.at(0);
            expect(emp.get('lastName')).to.exist;
            expect(emp.get('age')).not.to.exist;
            expect(emp.get('company.name')).to.exist;
            return done();
          });
        });
        return it('should expand related entities if selected property need expand', function(done) {
          var _this = this;
          this.employees.query.select('company.name', 'staff.lastName').limit(5);
          return this.employees.fetch({
            reset: true
          }).done(function() {
            var emp;
            emp = _this.employees.at(0);
            expect(emp.get('company.name')).to.exist;
            expect(emp.get('staff[0].lastName')).to.exist;
            expect(emp.get('staff[0].age')).not.to.exist;
            return done();
          });
        });
      });
      return describe('filter', function() {
        it('should accept and filter with a simple filter string', function(done) {
          var _this = this;
          this.employees.query.where('firstName begin a').orderBy({
            firstName: -1
          }).limit(5);
          return this.employees.fetch({
            reset: true
          }).done(function() {
            var emp, firstName;
            emp = _this.employees.at(0);
            firstName = emp.get('firstName');
            expect(firstName[0]).to.equal('A');
            return done();
          });
        });
        return it('should accept and filter with a complex filter string', function(done) {
          var _this = this;
          this.employees.query.where('firstName begin a and age = 32').orderBy({
            firstName: -1
          }).limit(5);
          return this.employees.fetch({
            reset: true
          }).done(function() {
            var emp, firstName;
            emp = _this.employees.at(0);
            firstName = emp.get('firstName');
            expect(firstName).to.equal('AVIS');
            return done();
          });
        });
      });
    });
  });

}).call(this);
