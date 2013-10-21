(function() {
  'use strict';
  define(['./underscore-ext', 'moment'], function(_ext, moment) {
    moment.wakFormat = 'DD!MM!YYYY';
    Function.prototype.property = function(prop, desc) {
      return Object.defineProperty(this.prototype, prop, desc);
    };
    Function.prototype.getter = function(prop, getFunc) {
      return Object.defineProperty(this.prototype, prop, {
        get: getFunc
      });
    };
    Function.prototype.lazyval = function(prop, getter) {
      return Object.defineProperty(this.prototype, prop, {
        get: function() {
          var privateProp;
          privateProp = '__' + prop;
          if (this[privateProp] != null) {
            return this[privateProp];
          }
          return this[privateProp] = getter.apply(this);
        }
      });
    };
    return {
      resolvedPromise: function(value) {
        var def;
        def = $.Deferred();
        def.resolve(value);
        return def.promise();
      },
      log: function(message) {
        return console.log(message);
      },
      "throw": function(message, Type) {
        if (Type == null) {
          Type = Error;
        }
        throw new Type(message);
      },
      throwIf: function(predicate, message) {
        if (predicate) {
          return this["throw"](message);
        }
      },
      moment: moment
    };
  });

}).call(this);
