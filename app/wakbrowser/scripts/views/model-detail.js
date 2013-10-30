(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['marionette', 'epoxy'], function() {
    var ModelDetail, _cleanName, _creatHtmlValue, _createBindings, _createEpoxyView, _createHtml, _createHtmlField, _createHtmlLink, _createHtmlText, _isValid, _ref;
    _isValid = function(attr) {
      return true;
    };
    _createHtmlText = function(attr, bindingClass, bindingName) {
      return {
        html: "<span data-bind=\"text:bindingName\" form-control\"></span>",
        bindings: 'span.' + {
          bindingClass: 'text:' + bindingName
        }
      };
    };
    _createHtmlLink = function(attr, bindingClass, bindingName) {
      return {
        html: "<a class=\"" + bindingClass + " form-control\"></a>",
        bindings: 'a.' + {
          bindingClass: 'text:' + bindingName
        }
      };
    };
    _creatHtmlValue = function(attr) {
      var binding, bindingAsCssClass, _ref;
      binding = _cleanName(attr.name);
      bindingAsCssClass = _.dasherize(binding);
      if ((_ref = attr.kind) === 'relatedEntity' || _ref === 'relatedEntities') {
        return _createHtmlLink(attr, bindingAsCssClass, binding);
      } else {
        return _createHtmlText(attr, bindingAsCssClass, binding);
      }
    };
    _createHtmlField = function(attr) {
      var title, val;
      title = attr.name;
      val = _creatHtmlValue(attr);
      return {
        html: "<div class=\"form-group\">\n  <label class=\"control-label col-sm-2\">" + title + "</label>\n  <div class=\"col-sm-10\">\n    " + val.html + "\n  </div>\n</div>",
        bindings: val.bindings
      };
    };
    _cleanName = function(name) {
      if (name === 'ID') {
        return '__KEY';
      }
      return name;
    };
    _createHtml = function(dataClass) {
      var attr, bindings, fld, html, key, val, _i, _len, _ref, _ref1;
      html = "<form class=\"form-horizontal\" role=\"form\">";
      bindings = {};
      _ref = dataClass.attr();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attr = _ref[_i];
        if (!(_isValid(attr))) {
          continue;
        }
        fld = _createHtmlField(attr);
        html += fld.html;
        _ref1 = fld.bindings;
        for (key in _ref1) {
          val = _ref1[key];
          bindings[key] = val;
        }
      }
      html += '</form>';
      return {
        html: html,
        bindings: bindings
      };
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
        bindings: _createBindings(model.dataClass)
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
