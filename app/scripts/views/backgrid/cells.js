(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['../../core/helpers', 'uritemplate', 'backgrid'], function(helpers, uriTemplate) {
    var ImageCell, TemplateCell, UriTemplateCell, WakCell, _ref, _ref1, _ref2, _ref3;
    WakCell = (function(_super) {
      __extends(WakCell, _super);

      function WakCell() {
        _ref = WakCell.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      WakCell.prototype.initialize = function(_arg) {
        this.column = _arg.column, this.model = _arg.model;
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
    UriTemplateCell = (function(_super) {
      __extends(UriTemplateCell, _super);

      function UriTemplateCell() {
        _ref1 = UriTemplateCell.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      UriTemplateCell.prototype.initialize = function() {
        this.uriTemplate = uriTemplate.parse(this.uriPattern);
        this.textTemplate = _.template(this.textTemplate);
        return WakCell.prototype.initialize.apply(this, arguments);
      };

      UriTemplateCell.prototype._render = function() {
        var modelAsJson, text, uri;
        modelAsJson = this.model.toJSON();
        uri = this.uriTemplate.expand(modelAsJson);
        text = this.textTemplate(modelAsJson);
        return this.$el.append("<a href=\"" + uri + "\">" + text + "</a>");
      };

      return UriTemplateCell;

    })(WakCell);
    TemplateCell = (function(_super) {
      __extends(TemplateCell, _super);

      function TemplateCell() {
        _ref2 = TemplateCell.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      TemplateCell.prototype.initialize = function() {
        return this.htmlTemplate = _.template(this.template);
      };

      TemplateCell.prototype._render = function() {
        var html, modelAsJson;
        modelAsJson = this.model.toJSON();
        html = this.htmlTemplate(modelAsJson);
        return this.$el.append(html);
      };

      return TemplateCell;

    })(WakCell);
    ImageCell = (function(_super) {
      __extends(ImageCell, _super);

      function ImageCell() {
        _ref3 = ImageCell.__super__.constructor.apply(this, arguments);
        return _ref3;
      }

      ImageCell.prototype.initialize = function() {};

      ImageCell.prototype._render = function() {
        var src, _ref4;
        src = (_ref4 = this.rawVal()) != null ? _ref4.__deferred.uri : void 0;
        if (src == null) {
          return null;
        }
        return this.$el.append("<a class=\"fancybox\" rel=\"group\" data-lightbox=\"img\" href=\"" + src + "\" target=\"_blank\"><img class=\"img-thumbnail\" src=\"" + src + "\" alt=\"\" /></a>");
      };

      return ImageCell;

    })(WakCell);
    Backgrid['UriTemplateCell'] = UriTemplateCell;
    Backgrid['TemplateCell'] = TemplateCell;
    Backgrid['ImageCell'] = ImageCell;
    return {
      WakCell: WakCell,
      ImageCell: ImageCell,
      UriTemplateCell: UriTemplateCell,
      TemplateCell: TemplateCell
    };
  });

}).call(this);
