(function() {
  'use strict';
  define([], function() {
    var BackboneWalker, _findSeparators, _isCollection, _isModel, _isObject, _read, _walkToBracket, _walkToDot;
    _isObject = function(object) {
      return typeof object === 'object';
    };
    _isModel = function(object) {
      return _isObject(object) && object instanceof Backbone.Model;
    };
    _isCollection = function(object) {
      return _isObject(object) && object instanceof Backbone.Collection;
    };
    _findSeparators = function(expression) {
      var bracketPos, dotPos;
      dotPos = expression.indexOf('.');
      bracketPos = expression.indexOf('[');
      dotPos = dotPos === -1 ? Infinity : dotPos;
      bracketPos = bracketPos === -1 ? Infinity : bracketPos;
      return {
        dot: dotPos,
        bracket: bracketPos,
        noneMatch: dotPos === Infinity && bracketPos === Infinity
      };
    };
    _read = function(str, separator) {
      var parts, remaining, val;
      parts = str.split(separator);
      val = parts[0];
      parts.splice(0, 1);
      remaining = parts.join(separator);
      return {
        val: val,
        remaining: remaining
      };
    };
    _walkToDot = function(model, expression) {
      var remaining, subProp, val, _ref;
      _ref = _read(expression, '.'), val = _ref.val, remaining = _ref.remaining;
      subProp = model.get(val);
      if (!_isModel(subProp || !_isCollection(subProp))) {
        throw new Error('Property ' + val + ' is not a model or a collection or is not fetched');
      }
      return subProp.walk(remaining);
    };
    _walkToBracket = function(model, expression) {
      var remaining, subModel, subProp, val, _ref, _ref1;
      _ref = _read(expression, '['), val = _ref.val, remaining = _ref.remaining;
      subProp = model.get(val);
      if (!_isCollection(subProp)) {
        throw new Error('Property ' + val + ' is not a collection or is not fetched');
      }
      _ref1 = _read(remaining, ']'), val = _ref1.val, remaining = _ref1.remaining;
      if (_.isBlank(remaining)) {
        throw new Error('Invalid walk expression ' + expression + ' : missing ]');
      }
      if (_.startsWith(remaining, '.')) {
        remaining = _.splice(remaining, 0, 1);
      }
      subModel = subProp.at(+val);
      return subModel.walk(remaining);
    };
    return BackboneWalker = (function() {
      function BackboneWalker(model) {
        this.model = model;
      }

      BackboneWalker.prototype.walk = function(expression) {
        var found, seps;
        seps = _findSeparators(expression);
        found = null;
        if (seps.noneMatch) {
          found = {
            model: this.model,
            property: expression
          };
        } else if (seps.dot < seps.bracket) {
          found = _walkToDot(this.model, expression);
        } else {
          found = _walkToBracket(this.model, expression);
        }
        found.val = function() {
          return Backbone.Model.prototype.get.call(model, this.property);
        };
        return found;
      };

      return BackboneWalker;

    })();
  });

}).call(this);
