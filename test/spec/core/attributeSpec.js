(function() {
  define(['chai', 'test-helpers'], function(_arg, helpers) {
    var expect;
    expect = _arg.expect;
    before(function(done) {
      return helpers.init(this, done);
    });
    return describe('Attribute', function() {
      before(function() {
        this.empClass = this.catalog.employee;
        return this.firstNameAttr = this.empClass.attr('firstName');
      });
      it('should have a name', function() {
        return expect(this.firstNameAttr.name).to.equal('firstName');
      });
      it('should have a type', function() {
        return expect(this.firstNameAttr.type).to.equal('string');
      });
      it('should have an indexed property', function() {
        return expect(this.firstNameAttr.indexed).to.be["true"];
      });
      it('should have an identifying property', function() {
        var id;
        expect(this.firstNameAttr.identifying).to.be["false"];
        id = this.empClass.attr('ID');
        return expect(id.identifying).to.be["true"];
      });
      it('should have a kind', function() {
        return expect(this.firstNameAttr.kind).to.equal('storage');
      });
      it('should have a dataClass', function() {
        return expect(this.firstNameAttr.dataClass).to.equal(this.empClass);
      });
      it('should have a catalog', function() {
        return expect(this.firstNameAttr.catalog).to.equal(this.catalog);
      });
      describe('isRaw', function() {
        return it('should be true for storage, calculated and alias kind', function() {
          var attr, expectedIsRaw, _i, _len, _ref, _ref1, _results;
          _ref = this.empClass.attr();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            attr = _ref[_i];
            expectedIsRaw = (_ref1 = attr.kind) === 'storage' || _ref1 === 'calculated' || _ref1 === 'alias';
            _results.push(expect(attr.isRaw).to.equal(expectedIsRaw));
          }
          return _results;
        });
      });
      describe('RelatedModel', function() {
        it('should return null if the attribute is not a related model', function() {
          expect(this.firstNameAttr.RelatedModel).to.be["null"];
          return expect(this.empClass.attr('managedCompanies').RelatedModel).to.be["null"];
        });
        return it('should return the related Model if the attribute is a related model', function() {
          var attr;
          attr = this.empClass.attr('company');
          expect(attr.RelatedModel).to.exist;
          return expect(attr.RelatedModel).to.equal(this.catalog.company.Model);
        });
      });
      describe('RelatedCollection', function() {
        it('should return null if the attribute is not a related collection', function() {
          expect(this.firstNameAttr.RelatedCollection).to.be["null"];
          return expect(this.empClass.attr('company').RelatedCollection).to.be["null"];
        });
        return it('should return the related Collection if the attribute is a related collection', function() {
          var attr;
          attr = this.empClass.attr('managedCompanies');
          expect(attr.RelatedCollection).to.exist;
          return expect(attr.RelatedCollection).to.equal(this.catalog.company.Collection);
        });
      });
      return describe('fromRaw', function() {
        var _expectFromRaw;
        _expectFromRaw = function(context, attrName, rawValue, expectedValue) {
          var attr, convertedValue;
          if (expectedValue == null) {
            expectedValue = rawValue;
          }
          attr = context.empClass.attr(attrName);
          convertedValue = attr.fromRaw(rawValue);
          return expect(convertedValue).to.equal(expectedValue);
        };
        it('should return the same value when the type is string, number and long', function() {
          _expectFromRaw(this, 'firstName', 'alexis');
          _expectFromRaw(this, 'age', 20);
          return _expectFromRaw(this, 'ID', 20);
        });
        it('should return a valid Date object when the type is date', function() {
          var attr, converted;
          attr = this.empClass.attr('birthDate');
          converted = attr.fromRaw('24!8!1954');
          expect(converted.year()).to.equal(1954);
          expect(converted.month()).to.equal(7);
          return expect(converted.date()).to.equal(24);
        });
        describe('with related model', function() {
          var _rawCompany;
          _rawCompany = {
            __deferred: {
              uri: '/rest/Company(8)',
              __KEY: '8'
            }
          };
          it('should return an instance of the related model when the kind is a relatedEntity', function() {
            var attr, model;
            attr = this.empClass.attr('company');
            model = attr.fromRaw(_rawCompany);
            return expect(model).to.be.an["instanceof"](this.catalog.company.Model);
          });
          it('should return a related model with a correct id', function() {
            var attr, model;
            attr = this.empClass.attr('company');
            model = attr.fromRaw(_rawCompany);
            return expect(model.id).to.equal(_rawCompany.__deferred.__KEY);
          });
          return it('should return null if the rawValue has a null value', function() {
            var attr, model;
            attr = this.empClass.attr('company');
            model = attr.fromRaw(null);
            return expect(model).to.be["null"];
          });
        });
        return describe('with related collection', function() {
          var _rawManagedCompanies;
          _rawManagedCompanies = {
            __deferred: {
              uri: '/rest/Employee(100)/managedCompanies?$expand=managedCompanies'
            }
          };
          it('should return an instance of the related collection when the kind is a relatedEntities', function() {
            var attr, collection;
            attr = this.empClass.attr('managedCompanies');
            collection = attr.fromRaw(_rawManagedCompanies);
            return expect(collection).to.be.an["instanceof"](this.catalog.company.Collection);
          });
          it('should return a related collection with a correct url by adding the subentity method', function() {
            var attr, collection;
            attr = this.empClass.attr('managedCompanies');
            collection = attr.fromRaw(_rawManagedCompanies);
            return expect(collection.url).to.equal(_rawManagedCompanies.__deferred.uri + '&$method=subentityset');
          });
          return it('should return null if the rawValue has a null value', function() {
            var attr, collection;
            attr = this.empClass.attr('managedCompanies');
            collection = attr.fromRaw(null);
            return expect(collection).to.be["null"];
          });
        });
      });
    });
  });

}).call(this);
