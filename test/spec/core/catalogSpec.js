(function() {
  'use strict';
  define(['core/catalog', 'chai', 'test-helpers'], function(Catalog, _arg, helpers) {
    var expect;
    expect = _arg.expect;
    before(function(done) {
      return helpers.init(this, done);
    });
    describe('load', function() {
      return it('should load catalog', function(done) {
        return Catalog.load().done(function(catalog) {
          expect(catalog).not.to.be["null"];
          return done();
        });
      });
    });
    describe('$classNames', function() {
      return it('should contains all dataclasses', function() {
        return expect(this.catalog.$classNames).to.have.length(4);
      });
    });
    describe('dataClasses (stored as properties)', function() {
      return it('should contains all dataclasses', function() {
        var className, _i, _len, _ref, _results;
        _ref = this.catalog.$classNames;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          className = _ref[_i];
          _results.push(expect(this.catalog[className]).to.exist);
        }
        return _results;
      });
    });
    describe('dataClass', function() {
      it('should contains Model', function() {
        var Model, className, _i, _len, _ref, _results;
        _ref = this.catalog.$classNames;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          className = _ref[_i];
          Model = this.catalog[className].Model;
          expect(Model).to.exist;
          _results.push(expect(Model).to.be.a["function"]);
        }
        return _results;
      });
      it('should contains Collection', function() {
        var Collection, className, _i, _len, _ref, _results;
        _ref = this.catalog.$classNames;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          className = _ref[_i];
          Collection = this.catalog[className].Collection;
          _results.push(expect(Collection).to.exist);
        }
        return _results;
      });
      it('should contains entities collection', function() {
        var className, entities, _i, _len, _ref, _results;
        _ref = this.catalog.$classNames;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          className = _ref[_i];
          entities = this.catalog[className].entities;
          _results.push(expect(entities).to.exist);
        }
        return _results;
      });
      it('should contains the dataClass itself', function() {
        var className, def, _i, _len, _ref, _results;
        _ref = this.catalog.$classNames;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          className = _ref[_i];
          def = this.catalog[className];
          _results.push(expect(def).to.exist);
        }
        return _results;
      });
      describe('Collection', function() {
        return it('should be a function (constructor)', function() {
          var Collection, className, _i, _len, _ref, _results;
          _ref = this.catalog.$classNames;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            className = _ref[_i];
            Collection = this.catalog[className].Collection;
            _results.push(expect(Collection).to.be.a["function"]);
          }
          return _results;
        });
      });
      return describe('entities', function() {
        return it('should be an instanceof Backbone.Collection and their own Collection class', function() {
          var className, entities, _i, _len, _ref, _results;
          _ref = this.catalog.$classNames;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            className = _ref[_i];
            entities = this.catalog[className].entities;
            expect(entities).to.be.an["instanceof"](Backbone.Collection);
            _results.push(expect(entities).to.be.an["instanceof"](this.catalog[className].Collection));
          }
          return _results;
        });
      });
    });
    return describe('DataClass', function() {
      before(function() {
        return this.empClass = this.catalog.employee;
      });
      it('should have a className', function() {
        return expect(this.empClass.className).to.equal('Employee');
      });
      it('should have a collectionName', function() {
        return expect(this.empClass.collectionName).to.equal('Employees');
      });
      it('should have a dataURI', function() {
        return expect(this.empClass.dataURI).to.equal('/rest/Employee');
      });
      return describe('attr', function() {
        it('should return all attributes when call without parameter', function() {
          return expect(this.empClass.attr()).to.have.length(15);
        });
        return it('should return the corresponding attribute when a parameter is specified', function() {
          var attr, _i, _len, _ref, _results;
          _ref = this.empClass.attr();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            attr = _ref[_i];
            _results.push(expect(this.empClass.attr(attr.name)).to.exist);
          }
          return _results;
        });
      });
    });
  });

}).call(this);
