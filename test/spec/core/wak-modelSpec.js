(function() {
  define(['chai', 'test-helpers'], function(_arg, helpers) {
    var assert, expect, shouldBeAValidModel;
    expect = _arg.expect, assert = _arg.assert;
    before(function(done) {
      return helpers.init(this, done);
    });
    describe('static properties', function() {
      it('should have a valid className', function() {
        expect(this.catalog.employee.Model.dataClass.className).to.equal('Employee');
        return expect(this.catalog.company.Model.dataClass.className).to.equal('Company');
      });
      return it('should have a reference to the catalog', function() {
        expect(this.catalog.employee.Model.catalog).to.equal(this.catalog);
        return expect(this.catalog.company.Model.catalog).to.equal(this.catalog);
      });
    });
    shouldBeAValidModel = function() {
      var expectedEmployee;
      expectedEmployee = {
        birthDateYear: 1965,
        firstName: 'VIRGINIA',
        companyName: 'Brendan Core Senior'
      };
      expectedEmployee = {
        birthDateYear: 1967,
        firstName: 'MARIO',
        companyName: 'Pico Myaki Badge'
      };
      it('should have an id', function() {
        return expect(this.emp.id).to.exist;
      });
      it('should have a valid url', function() {
        return expect(this.emp.url()).to.equal('/rest/Employee(' + this.emp.id + ')');
      });
      it('should have loaded it\'s properties', function() {
        return expect(this.emp.get('firstName')).to.equal(expectedEmployee.firstName);
      });
      it('should have a $stamp property', function() {
        return expect(this.emp.get('$stamp')).to.exist;
      });
      it('should return related entities properties as collections', function() {
        var managedCompanies;
        managedCompanies = this.emp.get('managedCompanies');
        return expect(managedCompanies).to.be.an["instanceof"](Backbone.Collection);
      });
      it('should have casted dates properties', function() {
        var date;
        date = this.emp.get('birthDate');
        return expect(date.year()).to.equal(expectedEmployee.birthDateYear);
      });
      describe('relatedEntity', function() {
        it('should return related entity property as a Model', function() {
          var company;
          company = this.emp.get('company');
          return expect(company).to.be.an["instanceof"](Backbone.Model);
        });
        return it('should be able to fetch that model', function(done) {
          var company;
          company = this.emp.get('company');
          return company.fetch().done(function() {
            expect(company.get('name')).to.equal(expectedEmployee.companyName);
            return done();
          });
        });
      });
      describe('relatedEntities', function() {
        it('should return related entities property as a Collection', function() {
          var managedCompanies;
          managedCompanies = this.emp.get('managedCompanies');
          return expect(managedCompanies).to.be.an["instanceof"](Backbone.Collection);
        });
        return it('should be able to fetch that collection', function(done) {
          var managedCompanies;
          managedCompanies = this.emp.get('managedCompanies');
          return managedCompanies.fetch().done(function() {
            var managedCompany;
            expect(managedCompanies).to.have.length(1);
            managedCompany = managedCompanies.at(0);
            expect(managedCompany.get('name')).to.equal(expectedEmployee.companyName);
            return done();
          });
        });
      });
      return describe('save', function() {
        it('should be able to update an employee for a basic type (string)', function(done) {
          var gender, invertedGender,
            _this = this;
          gender = this.emp.get('gender');
          invertedGender = gender === 'M' ? 'F' : 'M';
          this.emp.set('gender', invertedGender);
          return this.emp.save().done(function() {
            expect(_this.emp.get('gender')).to.equal(invertedGender);
            return done();
          }).fail(function() {
            assert.fail();
            return done();
          });
        });
        it('should be able to update an employee for a type that need conversion (date)', function(done) {
          var date, newDate,
            _this = this;
          date = this.emp.get('birthDate');
          if (date.month() === 2) {
            newDate = date.clone().set('month', 3);
          } else {
            newDate = date.clone().set('month', 2);
          }
          this.emp.set('birthDate', newDate);
          return this.emp.save().done(function() {
            var expectedDate;
            expectedDate = _this.emp.get('birthDate');
            expect(expectedDate.month()).to.equal(newDate.month());
            return done();
          }).fail(function() {
            helpers.testFail();
            return done();
          });
        });
        describe('handling errors', function() {
          var _isErrorInFirstName;
          _isErrorInFirstName = function(errors) {
            var error;
            expect(errors).to.have.length.above(0);
            error = errors[0];
            return expect(error.message).to.have.string('String length');
          };
          it('should return an array of errors in the fail callback when an error happends on server', function(done) {
            var _this = this;
            this.emp.set('firstName', 'thisIsATooBigStringForTheFirstNameAttributeWayAboveItsMaxLength');
            return this.emp.save().done(function() {
              helpers.testFail();
              return done();
            }).fail(function(errors) {
              _isErrorInFirstName(errors);
              return done();
            });
          });
          return it('should trigger the model error event', function(done) {
            var _this = this;
            this.emp.set('age', 'thisIsATooBigStringForTheFirstNameAttributeWayAboveItsMaxLength');
            this.emp.once('error', function() {
              _isErrorInFirstName(_this.emp.get('$errors'));
              return done();
            });
            return this.emp.save();
          });
        });
        return describe('related model', function() {
          return it('should be able to save a related model', function() {});
        });
      });
    };
    describe('loading by itself', function() {
      before(function(done) {
        var Employee, emp,
          _this = this;
        Employee = this.catalog.employee.Model;
        emp = new Employee({
          id: 1
        });
        return emp.fetch().done(function() {
          _this.emp = emp;
          return done();
        });
      });
      return shouldBeAValidModel();
    });
    describe('loading from collection', function() {
      before(function(done) {
        var employees,
          _this = this;
        employees = this.catalog.employee.entities;
        return employees.fetch({
          reset: true
        }).done(function() {
          _this.emp = employees.get(1);
          return done();
        });
      });
      return shouldBeAValidModel();
    });
    describe('url for new entity', function() {
      return it('should be the urlRoot of the collection', function() {
        var emp;
        emp = new this.catalog.employee.Model();
        return expect(emp.url()).to.equal('/rest/Employee');
      });
    });
    describe('expand', function() {
      return it('should load expanded data and load them as a model or collection', function(done) {
        var Employee, emp,
          _this = this;
        Employee = this.catalog.employee.Model;
        emp = new Employee({
          id: 1
        });
        return emp.expand('company', 'staff', 'managedCompanies').fetch().done(function() {
          var company, staff;
          company = emp.get('company');
          expect(company).to.be.an["instanceof"](Backbone.Model);
          expect(company.get('name')).to.equal('Pico Myaki Badge');
          staff = emp.get('staff');
          expect(staff).to.be.an["instanceof"](Backbone.Collection);
          expect(staff).to.have.length(6);
          return done();
        });
      });
    });
    describe('get', function() {
      before(function(done) {
        var Employee, emp,
          _this = this;
        Employee = this.catalog.employee.Model;
        emp = new Employee({
          id: 1
        });
        return emp.expand('company', 'staff', 'managedCompanies').fetch().done(function() {
          _this.emp = emp;
          return _this.emp.get('staff').at(0).fetch('company').done(function() {
            return done();
          });
        });
      });
      it('should support direct access to a related model', function() {
        var expectedCompanyName;
        expectedCompanyName = this.emp.get('company').get('name');
        return expect(this.emp.get('company.name')).to.equal(expectedCompanyName);
      });
      it('should throw an exception is the sub property is not a model or a collection', function() {
        var _this = this;
        return expect(function() {
          return _this.emp.get('firstName.length');
        }).to["throw"](Error);
      });
      it('should support direct access to a related collection', function() {
        var expectedCompanyName, found;
        expectedCompanyName = this.emp.get('staff').at(0).get('company').get('name');
        found = this.emp.get('staff[0].company.name');
        return expect(found).to.equal(expectedCompanyName);
      });
      return it('should throw an exception when the related model/collection is not fetched', function() {
        var _this = this;
        return expect(function() {
          return _this.emp.get('staff[0].company.manager[0]');
        }).to["throw"](Error);
      });
    });
    describe('set', function() {
      it('should support direct set to a related model', function() {
        this.emp.set('company.name', '4D');
        return expect(this.emp.get('company.name')).to.equal('4D');
      });
      return it('should support direct set to a related model via a collection', function() {
        this.emp.set('staff[0].company.name', '4D');
        return expect(this.emp.get('staff[0].company.name')).to.equal('4D');
      });
    });
    describe('save for new entity (create)', function() {
      it('should work', function(done) {
        var emp;
        emp = new this.catalog.employee.Model({
          firstName: 'Bob',
          lastName: 'Simon'
        });
        return emp.save().done(function() {
          expect(emp.get('firstName')).to.equal('Bob');
          expect(emp.get('lastName')).to.equal('Simon');
          expect(emp.get('fullName')).to.equal('Bob Simon');
          expect(emp.id).to.exist;
          return done();
        });
      });
      return it('should to an update if we try to save it later', function(done) {
        var emp;
        emp = new this.catalog.employee.Model({
          firstName: 'Bob',
          lastName: 'Simon'
        });
        return emp.save().done(function() {
          var originalId;
          originalId = emp.id;
          emp.set('lastName', 'Roups');
          return emp.save().done(function() {
            expect(emp.get('firstName')).to.equal('Bob');
            expect(emp.get('lastName')).to.equal('Roups');
            expect(emp.get('fullName')).to.equal('Bob Roups');
            expect(emp.id).to.equal(originalId);
            return done();
          });
        });
      });
    });
    describe('deleting an entity', function() {
      return it('should work', function(done) {
        var emp;
        emp = new this.catalog.employee.Model({
          firstName: 'Bob',
          lastName: 'Simon'
        });
        return emp.save().done(function() {
          return emp.destroy().done(function() {
            helpers.testSuccess();
            return done();
          }).fail(function() {
            helpers.testFail();
            return done();
          });
        });
      });
    });
    return describe('saving with a related entity', function() {
      it('should work', function(done) {
        var Employee, manager;
        Employee = this.catalog.employee.Model;
        manager = new Employee({
          firstName: 'Bob',
          lastName: 'TheManager'
        });
        return manager.save().done(function() {
          var emp;
          emp = new Employee({
            firstName: 'Jim',
            lastName: 'TheGuy',
            manager: manager
          });
          return emp.save().done(function() {
            helpers.testSuccess();
            return done();
          }).fail(function() {
            helpers.testFail();
            return done();
          });
        });
      });
      return it('should fail when the relatedEntity has not been saved', function(done) {
        var Employee, emp, manager;
        Employee = this.catalog.employee.Model;
        manager = new Employee({
          firstName: 'Bob',
          lastName: 'TheManager'
        });
        emp = new Employee({
          firstName: 'Jim',
          lastName: 'TheGuy',
          manager: manager
        });
        return emp.save().done(function() {
          helpers.testFail();
          return done();
        }).fail(function() {
          helpers.testSuccess();
          return done();
        });
      });
    });
  });

}).call(this);
