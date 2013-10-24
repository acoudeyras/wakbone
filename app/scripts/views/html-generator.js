(function() {
  var __slice = [].slice;

  define(['underscore'], function() {
    var HtmlGenerator, _addClassesHandler, _buildClasses, _methodBuilder;
    _buildClasses = function(type, callerClasses) {
      var classes, typeClasses;
      typeClasses = HtmlGenerator.defaultOptions[type].classNames || [];
      if (callerClasses == null) {
        callerClasses = [];
      }
      classes = typeClasses.concat(callerClasses);
      if (classes.length === 0) {
        return '';
      }
      return ' class="' + classes.join(' ') + '"';
    };
    _methodBuilder = function(method, name) {
      return function() {
        var args, classes, lastArg;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        lastArg = args[method.length - 1];
        classes = _buildClasses(name, lastArg);
        if (method.length === args.length) {
          args.pop();
        }
        args.push(classes);
        return method.apply(this, args);
      };
    };
    _addClassesHandler = function() {
      var method, name, _ref;
      _ref = HtmlGenerator.prototype;
      for (name in _ref) {
        method = _ref[name];
        if (typeof method === 'function') {
          HtmlGenerator.prototype[name] = _methodBuilder(method, name);
        }
      }
      return void 0;
    };
    HtmlGenerator = (function() {
      function HtmlGenerator(options) {
        if (options == null) {
          options = {};
        }
        this.options = _.extend(options, HtmlGenerator.defaultOptions);
      }

      HtmlGenerator.prototype.label = function(title, css) {
        var charAfterTitle;
        charAfterTitle = this.options.label.charAfterTitle;
        return "<label" + css + ">" + title + charAfterTitle + "</label>";
      };

      HtmlGenerator.prototype.text = function(css) {
        return "<span" + css + "></span>";
      };

      HtmlGenerator.prototype.textInput = function(css) {
        return "<input type=\"text\"" + css + ">";
      };

      HtmlGenerator.defaultOptions = {
        text: {},
        label: {
          charAfterTitle: ':'
        },
        textInput: {}
      };

      return HtmlGenerator;

    })();
    _addClassesHandler();
    return HtmlGenerator;
  });

}).call(this);
