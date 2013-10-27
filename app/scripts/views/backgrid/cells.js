(function() {
  define(['../../core/helpers', 'backgrid'], function(helpers) {
    var WakCell, build, cells;
    cells = {
      identity: {
        className: "uri-cell",
        _render: function() {
          var url, val;
          val = this.rawVal();
          url = '#entities/' + this.model.$def.collectionName + '/' + val;
          return this.$el.append($('<a>', {
            tabIndex: -1,
            href: url,
            title: 'Show entity'
          }).text(val));
        }
      },
      relatedEntity: {
        className: "uri-cell",
        _render: function() {
          return this.$el.append(this.renderer().relatedEntity());
        }
      },
      relatedEntities: {
        className: "uri-cell",
        _render: function() {
          return this.$el.append(this.renderer().relatedEntities());
        }
      },
      image: {
        className: "img-cell",
        _render: function() {
          return this.$el.append(this.renderer().image());
        }
      }
    };
    WakCell = Backgrid.Cell.extend({
      constructor: function(options) {
        this._renderer = renderer(options.model.$catalog);
        return Backgrid.Cell.prototype.constructor.apply(this, arguments);
      },
      renderer: function() {
        return this._renderer["with"](this.model, this.rawVal(), this.attr());
      },
      propName: function() {
        return this.column.get('name');
      },
      attr: function() {
        return this.model.attr(this.propName());
      },
      rawVal: function() {
        return this.model.get(this.propName());
      },
      defUri: function() {
        var _ref;
        return (_ref = this.rawVal()) != null ? _ref.__deferred.uri : void 0;
      },
      render: function() {
        this.$el.empty();
        if (typeof this._render === "function") {
          this._render();
        }
        this.delegateEvents();
        return this;
      }
    });
    build = function() {
      var _buildCell;
      _buildCell = function(name, options) {
        var cleanName;
        cleanName = _.capitalize(name) + 'Cell';
        return Backgrid[cleanName] = WakCell.extend(options);
      };
      Object.keys(cells).forEach(function(name) {
        return cells[name] = _buildCell(name, cells[name]);
      });
      return cells;
    };
    return build(cells);
  });

}).call(this);
