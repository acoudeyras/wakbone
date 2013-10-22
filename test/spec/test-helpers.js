(function() {
  'use strict';
  define(['core/catalog', 'chai'], function(Catalog, _arg) {
    var expect;
    expect = _arg.expect;
    return {
      init: function(context, done) {
        var _this = this;
        if (this.catalog != null) {
          context.catalog = this.catalog;
          return done();
        }
        return Catalog.load().done(function(catalog) {
          context.catalog = _this.catalog = catalog;
          return done();
        });
      },
      testFail: function() {
        return expect(true).to.be["false"];
      },
      testSuccess: function() {
        return expect(true).to.be["true"];
      }
    };
  });

}).call(this);
