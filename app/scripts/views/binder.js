(function() {
  define(['epoxy'], function() {
    var Binder, _mergeBindings;
    _mergeBindings = function(elements) {
      var bindings, elem, _i, _len;
      bindings = {};
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        elem = elements[_i];
        bindings[elem.binding.name] = elem.binding.value;
      }
      return bindings;
    };
    return Binder = (function() {
      function Binder(elements) {
        this.elements = elements;
        this.bindings = _mergeBindings(this.elements);
      }

      Binder.prototype.to = function(model) {
        this.model = model;
        return this;
      };

      Binder.prototype.inside = function(selector) {
        var BindingView;
        BindingView = Backbone.Epoxy.View.extend({
          el: selector,
          bindings: this.bindings
        });
        return new BindingView({
          model: this.model
        });
      };

      return Binder;

    })();
  });

}).call(this);
