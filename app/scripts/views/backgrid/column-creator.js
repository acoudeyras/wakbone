(function() {
  define(['../../core/helpers', './cells', './filter-header-cell'], function(helpers, cells, FilterHeaderCell) {
    var ColumnCreator;
    return ColumnCreator = (function() {
      function ColumnCreator(catalog, _arg) {
        this.catalog = catalog;
        this.attr = _arg.attr, this.title = _arg.title, this.cell = _arg.cell, this.editable = _arg.editable;
      }

      ColumnCreator.prototype.typeAlias = function() {
        var found;
        found = ColumnCreator.typesAlias[this.attr.type];
        if (found == null) {
          console.log("storage type " + this.attr.type + " not supported");
          return ColumnCreator.typesAlias.string;
        }
        return found;
      };

      ColumnCreator.property('type', {
        get: function() {
          if (this.attr.isRaw) {
            return this.typeAlias;
          }
          throw "kind " + kind + " not supported";
        }
      });

      ColumnCreator.prototype.getCell = function() {
        var alias;
        if (this.cell != null) {
          return this.cell;
        }
        alias = this.typeAlias();
        if (typeof alias === 'string') {
          return alias;
        }
        return alias.cell;
      };

      ColumnCreator.prototype.getFormatter = function() {
        var alias;
        alias = this.typeAlias();
        if (typeof alias === 'string') {
          return null;
        }
        return alias.formatter;
      };

      ColumnCreator.prototype.toColumn = function() {
        var column, formatter;
        column = {
          name: this.attr.name,
          label: this.attr.name,
          editable: this.editable != null ? this.editable : !this.attr.readOnly,
          cell: this.getCell(),
          headerCell: FilterHeaderCell,
          options: {
            attr: this.attr
          }
        };
        formatter = this.getFormatter();
        if (formatter != null) {
          column.formatter = formatter;
        }
        return column;
      };

      ColumnCreator.typesAlias = {
        string: 'string',
        long: 'integer',
        number: 'number',
        date: {
          cell: Backgrid.Extension.MomentCell.extend({
            modelFormat: "YYYY/M/D",
            displayLang: "zh-tw",
            displayFormat: "YYYY-MMM-DD"
          }),
          formatter: new Backgrid.Extension.MomentFormatter()
        },
        image: 'image',
        bool: 'boolean'
      };

      return ColumnCreator;

    })();
  });

}).call(this);
