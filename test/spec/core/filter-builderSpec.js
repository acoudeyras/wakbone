(function() {
  define(['core/filter-builder', 'chai', 'test-helpers'], function(FilterBuilder, _arg, helpers) {
    var expect;
    expect = _arg.expect;
    before(function(done) {
      return helpers.init(this, done);
    });
    return describe('FilterBuilder', function() {
      before(function() {
        var _this = this;
        return this.empFilter = function() {
          return new FilterBuilder(_this.catalog.employee);
        };
      });
      return it('should work', function() {
        var filter;
        return filter = this.empFilter().add('firstName', 'begin', 'a').build();
      });
    });
  });

}).call(this);
