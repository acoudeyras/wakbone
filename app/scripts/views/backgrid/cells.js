(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  define(['../../core/helpers', 'uritemplate', 'backgrid', 'moment.cell'], function(helpers, uriTemplate) {
    var ImageCell, TemplateCell, UriTemplateCell, WakCell;
    WakCell = (function(_super) {
      __extends(WakCell, _super);

      function WakCell() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        this.column = args[0], this.model = args[1];
        WakCell.__super__.constructor.apply(this, args);
      }

      WakCell.prototype.propName = function() {
        if (this.column == null) {
          debugger;
        }
        return this.column.get('name');
      };

      WakCell.prototype.attr = function() {
        return this.model.attr(this.propName());
      };

      WakCell.prototype.rawVal = function() {
        return this.model.get(this.propName());
      };

      WakCell.prototype.defUri = function() {
        var _ref;
        return (_ref = this.rawVal()) != null ? _ref.__deferred.uri : void 0;
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
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        this.uriTemplate = uriTemplate.parse(this.uriPattern);
        this.textTemplate = _.template(this.textTemplate);
        UriTemplateCell.__super__.constructor.apply(this, args);
      }

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
        this.htmlTemplate = _.template(this.template);
        TemplateCell.__super__.constructor.call(this);
      }

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
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        ImageCell.__super__.constructor.apply(this, args);
      }

      ImageCell.prototype._render = function() {
        var src, _ref;
        src = (_ref = this.rawVal()) != null ? _ref.__deferred.uri : void 0;
        if (src == null) {
          return null;
        }
        return this.$el.append("<a class=\"fancybox\" rel=\"group\" data-lightbox=\"img\" href=\"" + src + "\" target=\"_blank\"><img class=\"img-thumbnail\" src=\"" + src + "\" alt=\"\" /></a>");
      };

      return ImageCell;

    })(WakCell);
    Backgrid.Extension['UriTemplateCell'] = UriTemplateCell;
    Backgrid.Extension['TemplateCell'] = TemplateCell;
    Backgrid.Extension['ImageCell'] = ImageCell;
    return {
      WakCell: WakCell,
      ImageCell: ImageCell,
      UriTemplateCell: UriTemplateCell,
      TemplateCell: TemplateCell
    };
  });

}).call(this);
