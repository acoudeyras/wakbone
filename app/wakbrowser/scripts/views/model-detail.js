(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  define(['marionette', 'epoxy'], function() {
    var ModelDetail;
    return ModelDetail = (function(_super) {
      __extends(ModelDetail, _super);

      function ModelDetail() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        ModelDetail.__super__.constructor.apply(this, args);
      }

      ModelDetail.prototype.bindings = {
        "input.first-name": "value:firstName,events:['keyup']"
      };

      return ModelDetail;

    })(Backbone.Epoxy.View);
  });

}).call(this);
