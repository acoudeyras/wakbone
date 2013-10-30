(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['marionette', 'epoxy'], function() {
    var ModelDetail, _cleanName, _creatHtmlValue, _createBindings, _createEpoxyView, _createHtml, _createHtmlField, _createHtmlLink, _createHtmlText, _isValid, _ref;
    _isValid = function(attr) {
      return true;
    };
    _createHtmlText = function(attr) {
      var binding;
      binding = _cleanName(attr.name);
      return "<span data-bind=\"text:" + binding + "\" class=\"form-control\"></span>";
    };
    _createHtmlLink = function(attr) {
      var binding;
      if (attr.kind === 'relatedEntity') {
        binding = attr.name + '.__KEY';
      } else {
        binding = attr.name + '.__KEY';
      }
      return "<a data-bind=\"text:" + binding + ",href:" + binding + "\" class=\"form-control\"></a>";
    };
    _creatHtmlValue = function(attr) {
      var _ref;
      if ((_ref = attr.kind) === 'relatedEntity' || _ref === 'relatedEntities') {
        return _createHtmlLink(attr);
      } else {
        return _createHtmlText(attr);
      }
    };
    _createHtmlField = function(attr) {
      var title;
      title = attr.name;
      return "<div class=\"form-group\">\n  <label class=\"control-label col-sm-2\">" + title + "</label>\n  <div class=\"col-sm-10\">\n    " + (_creatHtmlValue(attr)) + "\n  </div>\n</div>";
    };
    _cleanName = function(name) {
      if (name === 'ID') {
        return '__KEY';
      }
      return name;
    };
    _createHtml = function(dataClass) {
      var attr, html, _i, _len, _ref;
      html = "<form class=\"form-horizontal\" role=\"form\">";
      _ref = dataClass.attr();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attr = _ref[_i];
        if (_isValid(attr)) {
          html += _createHtmlField(attr);
        }
      }
      return html += '</form>';
    };
    _createBindings = function(dataClass) {
      var attr, bindingAsCssClass, bindings, name, _i, _len, _ref;
      bindings = {};
      _ref = dataClass.attr();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attr = _ref[_i];
        if (!(_isValid(attr))) {
          continue;
        }
        name = _cleanName(attr.name);
        bindingAsCssClass = _.dasherize(name);
        bindings['.' + bindingAsCssClass] = 'text:' + name;
      }
      return bindings;
    };
    _createEpoxyView = function(model, el) {
      var html;
      html = _createHtml(model.dataClass);
      $(el).html(html);
      return Backbone.Epoxy.View.extend({
        el: el,
        bindings: 'data-bind'
      });
    };
    return ModelDetail = (function(_super) {
      __extends(ModelDetail, _super);

      function ModelDetail() {
        _ref = ModelDetail.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      ModelDetail.prototype.render = function() {
        var EpoxyView;
        EpoxyView = _createEpoxyView(this.model, this.el);
        this.epoxyView = new EpoxyView({
          model: this.model
        });
        return this;
      };

      return ModelDetail;

    })(Backbone.View);
  });

}).call(this);
