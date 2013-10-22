(function() {
  'use strict';
  define(['core/orderby-parser', 'chai'], function(parse, _arg) {
    var expect;
    expect = _arg.expect;
    describe('with one string', function() {
      it('should parse one order without direction (default is ASC)', function() {
        return expect(parse(['firstName'])).to.deep.equal({
          firstName: 'ASC'
        });
      });
      it('should parse one order with a direction', function() {
        expect(parse(['firstName ASC'])).to.deep.equal({
          firstName: 'ASC'
        });
        return expect(parse(['firstName DESC'])).to.deep.equal({
          firstName: 'DESC'
        });
      });
      return it('should parse multiple orderby correctly', function() {
        return expect(parse(['firstName, lastName DESC, age ASC'])).to.deep.equal({
          firstName: 'ASC',
          lastName: 'DESC',
          age: 'ASC'
        });
      });
    });
    describe('with multiple strings', function() {
      return it('should parse all members correctly', function() {
        return expect(parse(['firstName', 'lastName DESC'])).to.deep.equal({
          firstName: 'ASC',
          lastName: 'DESC'
        });
      });
    });
    return describe('with an object', function() {
      it('should parse on order by', function() {
        return expect(parse([
          {
            firstName: 'ASC'
          }
        ])).to.deep.equal({
          firstName: 'ASC'
        });
      });
      it('should be permissive on ASC values', function() {
        return expect(parse([
          {
            firstName: true,
            lastName: 1,
            age: 'asc'
          }
        ])).to.deep.equal({
          firstName: 'ASC',
          lastName: 'ASC',
          age: 'ASC'
        });
      });
      it('should be permissive on DESC values', function() {
        return expect(parse([
          {
            firstName: false,
            lastName: -1,
            age: 'desc',
            birthDate: 0
          }
        ])).to.deep.equal({
          firstName: 'DESC',
          lastName: 'DESC',
          age: 'DESC',
          birthDate: 'DESC'
        });
      });
      return it('should parse multiple order by', function() {
        return expect(parse([
          {
            firstName: 'ASC',
            lastName: -1,
            age: true
          }
        ])).to.deep.equal({
          firstName: 'ASC',
          lastName: 'DESC',
          age: 'ASC'
        });
      });
    });
  });

}).call(this);
