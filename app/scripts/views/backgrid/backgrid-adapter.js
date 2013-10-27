(function() {
  define(['./column-creator', 'backgrid'], function(ColumnCreator) {
    var BackgridAdapter;
    return BackgridAdapter = (function() {
      function BackgridAdapter(_arg) {
        this.collection = _arg.collection, this.columns = _arg.columns, this.catalog = _arg.catalog;
      }

      BackgridAdapter.prototype.buildAllOptions = function() {};

      BackgridAdapter.prototype.buildPagingFooter = function() {};

      BackgridAdapter.prototype.buildCols = function() {
        var column, _i, _len, _ref, _results;
        _ref = this.columns;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          column = _ref[_i];
          _results.push(new ColumnCreator(this.catalog, column).toColumn());
        }
        return _results;
      };

      BackgridAdapter.prototype.buildGrid = function() {
        var columns;
        columns = this.buildCols();
        return new Backgrid.Grid({
          collection: this.collection,
          columns: columns,
          className: 'table-hover backgrid'
        });
      };

      return BackgridAdapter;

    })();
  });

}).call(this);
