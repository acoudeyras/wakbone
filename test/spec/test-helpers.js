(function() {
  'use strict';
  define(['catalog'], function(Catalog) {
    return {
      init: function(context, done) {
        var _this = this;
        if (this.catalog != null) {
          context.catalog = this.catalog;
          return done();
        }
        return Catalog.load().done(function(catalog) {
          console.log('Loading catalog');
          context.catalog = _this.catalog = catalog;
          return done();
        });
      }
    };
  });

}).call(this);
