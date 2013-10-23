(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['stickit'], function() {
    var LabelView, _ref;
    return LabelView = (function(_super) {
      __extends(LabelView, _super);

      function LabelView() {
        _ref = LabelView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      LabelView.prototype.initialize = function(options) {
        this.bindings = options.bindings;
        return LabelView.__super__.initialize.call(this, arguments);
      };

      LabelView.prototype.render = function() {
        console.log(this.bindings);
        console.log(this.model);
        this.$el.html('<div/> <input class="title" type="text"><span class="title">');
        this.stickit();
        return this;
      };

      return LabelView;

    })(Backbone.View);
  });

}).call(this);
