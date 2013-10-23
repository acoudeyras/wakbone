(function() {
  define(['underscore.string'], function(_str) {
    var _extensions;
    _.mixin(_.str.exports());
    _extensions = {
      lowerCamelize: function(str) {
        str = _.camelize(str);
        return str[0].toLowerCase() + str.substring(1, str.length);
      }
    };
    _.mixin(_extensions);
    return null;
  });

}).call(this);
