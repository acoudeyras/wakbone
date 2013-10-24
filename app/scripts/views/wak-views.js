(function() {
  var __slice = [].slice;

  define(['./wak-view-generator', './binder'], function(WakViewGenerator, Binder) {
    var WakViews;
    return WakViews = (function() {
      function WakViews(catalog) {
        this.catalog = catalog;
        this.create = new WakViewGenerator(this.catalog);
      }

      WakViews.prototype.bind = function() {
        var elements;
        elements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return new Binder(elements);
      };

      return WakViews;

    })();
  });

}).call(this);
