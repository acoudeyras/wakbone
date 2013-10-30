(function() {
  define(['../../../../wakbone/scripts/views/backgrid/backgrid-adapter', '../../../../wakbone/scripts/views/backgrid/cells', 'marionette'], function(BackgridAdapter, cells) {
    var CollectionGrid, _createUriTemplateCell, _getCell, _getIdCell, _getRelatedCell, _getRelatedsCell;
    _getRelatedCell = function(attr) {
      return {
        textTemplate: "<% if (" + attr.name + "!= null) { %>\n  <%= " + attr.name + ".__KEY %>\n<% } %>",
        uriPattern: '#models/' + attr.relatedDataClass.name + '/{__KEY}'
      };
    };
    _getRelatedsCell = function(attr) {
      return {
        textTemplate: 'See related',
        uriPattern: '#cols/' + attr.relatedDataClass.name + '/' + attr.path + '.ID/{__KEY}'
      };
    };
    _getIdCell = function(attr) {
      return {
        textTemplate: "<%= __KEY %>",
        uriPattern: '#models/' + attr.dataClass.name + '/{__KEY}'
      };
    };
    _createUriTemplateCell = function(_arg) {
      var textTemplate, uriPattern;
      uriPattern = _arg.uriPattern, textTemplate = _arg.textTemplate;
      return cells.UriTemplateCell.extend({
        uriPattern: uriPattern,
        textTemplate: textTemplate
      });
    };
    _getCell = function(attr) {
      var uriCellDef;
      uriCellDef = null;
      if (attr.kind === 'relatedEntities') {
        uriCellDef = _getRelatedsCell(attr);
      } else if (attr.kind === 'relatedEntity') {
        uriCellDef = _getRelatedCell(attr);
      } else if (attr.identifying) {
        uriCellDef = _getIdCell(attr);
      }
      if (uriCellDef != null) {
        return _createUriTemplateCell(uriCellDef);
      }
      return null;
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
