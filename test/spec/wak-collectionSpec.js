(function() {
  'use strict';
  define(['wak-collection', 'chai', 'test-helpers'], function(WakCollection, _arg, helpers) {
    var expect;
    expect = _arg.expect;
    before(function(done) {
      return helpers.init(this, done);
    });
    describe('class', function() {
      it('should have an url', function() {
        return expect(this.catalog.employee.entities.url).to.equal('/rest/Employee');
      });
      it('should have a className', function() {
        return expect(this.catalog.employee.entities.className).to.equal('Employee');
      });
      return it('should have a collectionName', function() {
        return expect(this.catalog.employee.entities.collectionName).to.equal('Employees');
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
    return describe('$state', function() {
      return describe('limit', function() {
        return it('should add a $limit parameter in url if setted', function(done) {
          var _this = this;
          this.employees.query.limit(10);
          return this.employees.fetch({
            reset: true
          }).done(function() {
            expect(_this.employees).to.have.length(100);
            return done();
          });
        });
      });
    });
  });

}).call(this);
