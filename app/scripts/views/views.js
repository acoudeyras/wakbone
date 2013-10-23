(function() {
  define(['./label'], function(LabelView) {
    return {
      newLabel: function(el, model, property) {
        return new LabelView({
          model: model,
          el: el,
          bindings: {
            '.title': property
          }
        }).render();
      },
      within: function(container) {
        var $container, _render;
        $container = $(container);
        _render = function(model, property) {
          var _createWidget;
          _createWidget = function(widget) {
            var $el;
            $el = $('<div>');
            $container.append($el);
            new LabelView({
              model: model,
              el: $el,
              bindings: {
                '.title': property
              }
            }).render();
            return {
              render: _render
            };
          };
          return {
            withA: _createWidget,
            withAn: _createWidget
          };
        };
        return {
          render: _render
        };
      }
    };
  });

}).call(this);
