(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['marionette', 'epoxy'], function() {
    var ModelDetail, _cleanName, _creatHtmlValue, _createEpoxyView, _createHtml, _createHtmlField, _createHtmlLink, _createHtmlText, _createViewModel, _ref;
    _createHtmlText = function(attr) {
      var binding;
      binding = _cleanName(attr.name);
      return "<span data-bind=\"text:" + binding + "\" class=\"form-control\"></span>";
    };
    _createHtmlLink = function(attr) {
      return "<a data-bind=\"text:" + (attr.name + '__KEY') + ",attr:{href:" + (attr.name + '__URL') + "}\" class=\"form-control\"></a>";
    };
    _creatHtmlValue = function(attr) {
      var a, _ref;
      if ((_ref = attr.kind) === 'relatedEntity' || _ref === 'relatedEntities') {
        a = _createHtmlLink(attr);
        console.log(a);
        return a;
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
        html += _createHtmlField(attr);
      }
      return html += '</form>';
    };
    _createViewModel = function(model) {
      var attr, relatedValues, url, val, _i, _j, _len, _len1, _ref, _ref1;
      relatedValues = {};
      _ref = model.dataClass.attr();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attr = _ref[_i];
        if (!(attr.kind === 'relatedEntity')) {
          continue;
        }
        val = model.get(attr.name);
        url = null;
        if (val != null) {
          val = val.id;
          url = '#models/' + attr.relatedDataClass.name + '/' + val;
        }
        relatedValues[attr.name + '__KEY'] = val;
        relatedValues[attr.name + '__URL'] = url;
      }
      _ref1 = model.dataClass.attr();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        attr = _ref1[_j];
        if (!(attr.kind === 'relatedEntities')) {
          continue;
        }
        relatedValues[attr.name + '__KEY'] = 'See relateds';
        url = '#cols/' + attr.relatedDataClass.name + '/' + attr.path + '.ID/' + model.id;
        relatedValues[attr.name + '__URL'] = url;
      }
      return new Backbone.Model(relatedValues);
    };
    _createEpoxyView = function(model, el) {
      var html;
      html = _createHtml(model.dataClass);
      $(el).html(html);
      return Backbone.Epoxy.View.extend({
        el: el,
        bindings: 'data-bind',
        viewModel: _createViewModel(model)
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
