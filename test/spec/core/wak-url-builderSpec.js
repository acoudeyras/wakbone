(function() {
  'use strict';
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['core/wak-url-builder', 'chai'], function(UrlBuilder, _arg) {
    var expect, rootUrl, urlBuilder;
    expect = _arg.expect;
    rootUrl = 'http://localhost:8080';
    urlBuilder = function() {
      return new UrlBuilder(rootUrl + '/Person');
    };
    return describe('UrlBuilder', function() {
      describe('url', function() {
        return it('without other parameters should concatenate root and entityName', function() {
          var url;
          url = urlBuilder().url;
          return expect(url).to.equal('http://localhost:8080/Person');
        });
      });
      describe('where', function() {
        return it('should add $filter query parameter in url', function() {
          var url;
          url = urlBuilder().where('age<10').url;
          return expect(url).to.equal('http://localhost:8080/Person?$filter="age<10"');
        });
      });
      describe('orderBy', function() {
        it('should add $orderby query parameter in url', function() {
          var url;
          url = urlBuilder().orderBy({
            'age': 'ASC'
          }).url;
          return expect(url).to.equal('http://localhost:8080/Person?$orderby=age ASC');
        });
        return it('should work with multiple orderby', function() {
          var url;
          url = urlBuilder().orderBy({
            'age': 'ASC',
            'salary': 'DESC'
          }).url;
          return expect(url).to.equal('http://localhost:8080/Person?$orderby=age ASC,salary DESC');
        });
      });
      describe('expand', function() {
        it('should add $expand query parameter in url', function() {
          var url;
          url = urlBuilder().expand('company').url;
          return expect(url).to.equal('http://localhost:8080/Person?$expand=company');
        });
        return it('should work with multiple expand', function() {
          var url;
          url = urlBuilder().expand('company', 'manager').url;
          return expect(url).to.equal('http://localhost:8080/Person?$expand=company,manager');
        });
      });
      describe('skip & limit & timeout', function() {
        var _execEach;
        _execEach = function(value) {
          var method, methods, result, _i, _len;
          methods = ['limit', 'skip', 'timeout'];
          result = {};
          for (_i = 0, _len = methods.length; _i < _len; _i++) {
            method = methods[_i];
            result[method] = urlBuilder()[method](value).url;
          }
          result.allEquals = function(expectedUrl) {
            var url, _results;
            _results = [];
            for (method in this) {
              url = this[method];
              if (__indexOf.call(methods, method) >= 0) {
                _results.push(expect(url).to.equal(expectedUrl));
              }
            }
            return _results;
          };
          return result;
        };
        it('should add corresponding query parameter in url', function() {
          var values;
          values = _execEach(100);
          expect(values.limit).to.equal('http://localhost:8080/Person?$limit=100');
          expect(values.skip).to.equal('http://localhost:8080/Person?$skip=100');
          return expect(values.timeout).to.equal('http://localhost:8080/Person?$timeout=100');
        });
        it('should cast string to number if possible', function() {
          var values;
          values = _execEach('100');
          expect(values.limit).to.equal('http://localhost:8080/Person?$limit=100');
          expect(values.skip).to.equal('http://localhost:8080/Person?$skip=100');
          return expect(values.timeout).to.equal('http://localhost:8080/Person?$timeout=100');
        });
        return it('should not add a bad parameter but not throw an exception', function() {
          var values;
          values = _execEach('a');
          values.allEquals('http://localhost:8080/Person');
          values = _execEach(null);
          return values.allEquals('http://localhost:8080/Person');
        });
      });
      describe('select', function() {
        it('should add selected property in url path', function() {
          var url;
          url = urlBuilder().select('name').url;
          return expect(url).to.equal('http://localhost:8080/Person/name');
        });
        it('should separate multiple selected properties by , in url path', function() {
          var url;
          url = urlBuilder().select('name', 'salary', 'age').url;
          return expect(url).to.equal('http://localhost:8080/Person/name,salary,age');
        });
        return xit('could be call multiple times', function() {
          var url;
          url = urlBuilder().select('name').select('salary').select('age').url;
          return expect(url).to.equal('http://localhost:8080/Person/name,salary,age');
        });
      });
      describe('clearSelect', function() {
        return it('should remove selected properties', function() {
          var url;
          url = urlBuilder().select('name').clearSelect().url;
          expect(url).to.equal('http://localhost:8080/Person');
          url = urlBuilder().select('name', 'age').clearSelect().url;
          return expect(url).to.equal('http://localhost:8080/Person');
        });
      });
      describe('distinct', function() {
        it('should add $distinct query parameter in url', function() {
          var url;
          url = urlBuilder().distinct('name').url;
          return expect(url).to.equal('http://localhost:8080/Person/name?$distinct=true');
        });
        return it('should remove previously added select', function() {
          var url;
          url = urlBuilder().select('age').distinct('name').url;
          return expect(url).to.equal('http://localhost:8080/Person/name?$distinct=true');
        });
      });
      describe('compute', function() {
        it('when just the property name is specified, should add $compute query parameter in url with $all keyword', function() {
          var url;
          url = urlBuilder().compute('name').url;
          return expect(url).to.equal('http://localhost:8080/Person/name?$compute=$all');
        });
        it('when the keyword is specified, should use it', function() {
          var url;
          url = urlBuilder().compute('name', 'count').url;
          return expect(url).to.equal('http://localhost:8080/Person/name?$compute=count');
        });
        return it('when and invalid keyword is specified, should throw an exception', function() {
          return expect(function() {
            return urlBuilder().compute('name', 'diff');
          }).to["throw"](Error);
        });
      });
      describe('key', function() {
        return it('should add the entity key in url', function() {
          var url;
          url = urlBuilder().key('123').url;
          return expect(url).to.equal('http://localhost:8080/Person(123)');
        });
      });
      return describe('everything combined', function() {
        return it('should work', function() {
          return urlBuilder();
        });
      });
    });
  });

}).call(this);
