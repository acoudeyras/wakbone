(function() {
  define(['../../../../wakbone/scripts/views/backgrid/backgrid-adapter', '../../../../wakbone/scripts/views/backgrid/cells', 'marionette'], function(BackgridAdapter, cells) {
    var CollectionGrid, _getCell;
    _getCell = function(attr) {
      var attrName, reverseDataClass, uriPattern, _ref;
      if ((_ref = attr.kind) !== 'relatedEntities' && _ref !== 'relatedEntity') {
        return null;
      }
      attrName = attr.name === 'ID' ? '__KEY' : attr.name;
      if (attr.kind === 'relatedEntities') {
        reverseDataClass = attr.catalog.$entryFromCollectionName(attr.type);
        attrName = 'See related';
        uriPattern = '#cols/' + reverseDataClass.name + '/' + attr.path + '/{__KEY}';
      } else {
        attrName = '<%= __KEY %>';
        uriPattern = '/{__KEY}';
      }
      return cells.UriTemplateCell.extend({
        uriPattern: uriPattern,
        textTemplate: attrName
      });
    };
    return CollectionGrid = Backbone.View.extend({
      initialize: function(options) {
        return Backbone.View.prototype.initialize.apply(this, arguments);
      },
      setDataClass: function(dataClass) {
        this.dataClass = dataClass;
        return this.render();
      },
      _buildColumns: function() {
        var attr, columns, _i, _len, _ref;
        columns = [];
        _ref = this.dataClass.attr();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          attr = _ref[_i];
          columns.push({
            attr: attr,
            title: attr.name,
            editable: false,
            cell: _getCell(attr)
          });
        }
        return columns;
      },
      render: function() {
        var columns, grid;
        this.$el.empty();
        if (!this.dataClass) {
          return;
        }
        columns = this._buildColumns();
        this.backgridAdapter = new BackgridAdapter({
          collection: this.dataClass.entities,
          columns: columns,
          catalog: this.dataClass.catalog
        });
        grid = this.backgridAdapter.buildGrid();
        this.$el.append(grid.render().$el);
        /*
        paginator = new Backgrid.Extension.Paginator(
          collection: @collection
        )
        @$el.append paginator.render().$el
        */

        return this;
      }
    });
  });

}).call(this);
