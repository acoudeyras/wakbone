(function() {
  define(['../../core/helpers', './cells', './filter-header-cell'], function(helpers, cells, FilterHeaderCell) {
    var ColumnCreator;
    return ColumnCreator = (function() {
      function ColumnCreator(catalog, _arg) {
        this.catalog = catalog;
        this.attr = _arg.attr, this.title = _arg.title;
      }

      ColumnCreator.property('rawType', {
        get: function() {
          var found;
          found = ColumnCreator.rawTypes[this.attr.type];
          if (!found) {
            console.log("storage type " + this.attr.type + " not supported");
            return 'string';
          }
          return found;
        }
      });

      ColumnCreator.property('formatter', {
        get: function() {
          return formatters[this.attr.kind];
        }
      });

      ColumnCreator.property('cell', {
        get: function() {
          var custom, kind;
          kind = this.attr.identifying ? 'identity' : this.attr.kind;
          custom = cells[kind];
          if (custom != null) {
            return kind;
          }
          return this.type;
        }
      });

      ColumnCreator.property('type', {
        get: function() {
          var _ref;
          if (this.attr.isRaw) {
            return this.rawType;
          }
          if ((_ref = this.attr.kind) === 'relatedEntities' || _ref === 'relatedEntity') {
            return 'uri';
          }
          throw "kind " + kind + " not supported";
        }
      });

      ColumnCreator.prototype.toColumn = function() {
        return {
          name: this.attr.name,
          label: this.attr.name,
          editable: !this.attr.readOnly,
          cell: this.cell,
          headerCell: FilterHeaderCell,
          options: {
            attr: this.attr
          }
        };
      };

      ColumnCreator.rawTypes = {
        string: 'string',
        long: 'integer',
        number: 'number',
        date: 'date',
        image: 'image',
        bool: 'boolean'
      };

      return ColumnCreator;

    })();
  });

}).call(this);
