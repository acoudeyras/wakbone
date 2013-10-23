(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  define([], function() {
    var _check, _checkAll, _checkers;
    _checkers = {
      notNull: {
        message: 'should not be null',
        predicate: function(obj) {
          return obj != null;
        }
      },
      isString: {
        message: 'should be of type string',
        predicate: function(obj) {
          return typeof obj === 'string';
        }
      },
      notEmpty: {
        message: 'should not be empty',
        predicate: function(obj) {
          return (obj != null ? obj.length : void 0) > 0;
        }
      },
      "in": {
        message: 'should in the list',
        predicate: function(obj, _arg) {
          var list;
          list = _arg[0];
          return __indexOf.call(list, obj) >= 0;
        }
      }
    };
    _checkAll = function(objects, message, predicate, args) {
      return objects.forEach(function(obj) {
        if (!predicate(obj, args)) {
          throw new Error(message);
        }
      });
    };
    return _check = function() {
      var objects, _buildCheckers;
      objects = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _buildCheckers = function() {
        var builded;
        builded = {};
        Object.keys(_checkers).forEach(function(name) {
          var checker;
          checker = _checkers[name];
          return builded[name] = function() {
            var args;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            _checkAll(objects, checker.message, checker.predicate, args);
            return this;
          };
        });
        return builded;
      };
      return _buildCheckers();
    };
  });

}).call(this);
