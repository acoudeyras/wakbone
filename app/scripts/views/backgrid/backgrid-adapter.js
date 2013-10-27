(function() {
  define(['./filter-header-cell', 'backgrid'], function(FilterHeaderCell) {
    var BackgridAdapter;
    return BackgridAdapter = (function() {
      function BackgridAdapter(_arg) {
        this.collection = _arg.collection, this.columns = _arg.columns;
      }

      BackgridAdapter.prototype.buildAllOptions = function() {};

      BackgridAdapter.prototype.buildPagingFooter = function() {};

      BackgridAdapter.prototype.buildCols = function() {};

      BackgridAdapter.prototype.buildGrid = function() {};

      return BackgridAdapter;

    })();
  });

}).call(this);
