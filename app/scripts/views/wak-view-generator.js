(function() {
  define(['../core/helpers', './html-generator'], function(helpers, HtmlGenerator) {
    var ViewResult, WakViewGenerator, _toClassName;
    _toClassName = function(attr) {
      return _.dasherize(attr.name);
    };
    ViewResult = (function() {
      function ViewResult(html, binding, attr) {
        this.html = html;
        this.binding = binding;
        this.attr = attr;
      }

      ViewResult.lazyval('$el', function() {
        return $(this.html);
      });

      return ViewResult;

    })();
    return WakViewGenerator = (function() {
      function WakViewGenerator(catalog) {
        this.catalog = catalog;
        this.html = new HtmlGenerator();
      }

      WakViewGenerator.prototype._ensureAttr = function(attr) {
        if (typeof attr === 'string') {
          attr = this.catalog.$attr(attr);
        }
        return attr;
      };

      WakViewGenerator.prototype.input = function(title, attr) {
        var className, input, label;
        attr = this._ensureAttr(attr);
        label = this.html.label(title);
        className = _toClassName(attr);
        input = this.html.textInput(className);
        return new ViewResult(label + input, {
          name: "input." + className,
          value: "value:" + attr.name + ",events:['keyup']"
        }, attr);
      };

      WakViewGenerator.prototype.text = function(title, attr) {
        var className, label, text;
        attr = this._ensureAttr(attr);
        label = this.html.label(title);
        className = _toClassName(attr);
        text = this.html.text(className);
        return new ViewResult(label + text, {
          name: "span." + className,
          value: "text:" + attr.name
        }, attr);
      };

      return WakViewGenerator;

    })();
  });

}).call(this);
