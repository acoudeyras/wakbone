(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['../../core/helpers', 'backgrid'], function(helpers) {
    var ImageCell, UriCell, WakCell, build, cells, _ref, _ref1, _ref2;
    WakCell = (function(_super) {
      __extends(WakCell, _super);

      function WakCell() {
        _ref = WakCell.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      WakCell.prototype.initialize = function(_arg) {
        var model;
        model = _arg.model;
      };

      WakCell.prototype.propName = function() {
        return this.column.get('name');
      };

      WakCell.prototype.attr = function() {
        return this.model.attr(this.propName());
      };

      WakCell.prototype.rawVal = function() {
        return this.model.get(this.propName());
      };

      WakCell.prototype.defUri = function() {
        var _ref1;
        return (_ref1 = this.rawVal()) != null ? _ref1.__deferred.uri : void 0;
      };

      WakCell.prototype.render = function() {
        this.$el.empty();
        if (typeof this._render === "function") {
          this._render();
        }
        this.delegateEvents();
        return this;
      };

      return WakCell;

    })(Backgrid.Cell);
    UriCell = (function(_super) {
      __extends(UriCell, _super);

      function UriCell() {
        _ref1 = UriCell.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      UriCell.prototype.className = "uri-cell";

      return UriCell;

    })(WakCell);
    ImageCell = (function(_super) {
      __extends(ImageCell, _super);

      function ImageCell() {
        _ref2 = ImageCell.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      ImageCell.prototype.className = "img-cell";

      return ImageCell;

    })(WakCell);
    Backgrid['UriCell'] = UriCell;
    Backgrid['ImageCell'] = ImageCell;
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
        var _ref3;
        return (_ref3 = this.rawVal()) != null ? _ref3.__deferred.uri : void 0;
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
    return {
      WakCell: WakCell,
      UriCell: UriCell,
      ImageCell: ImageCell
    };
  });

}).call(this);
