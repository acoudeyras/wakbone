(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define([], function() {
    var parse, _directionsValues, _parseArray, _parseDirection, _parseObject, _parseOne, _parseOneFromString;
    _directionsValues = {
      ASC: ['ASC', 'asc', 1, true],
      DESC: ['DESC', 'desc', 0, -1, false]
    };
    _parseDirection = function(direction) {
      if (direction == null) {
        return 'ASC';
      }
      if (typeof direction === 'string') {
        direction = direction.trim();
      }
      if (__indexOf.call(_directionsValues.ASC, direction) >= 0) {
        return 'ASC';
      }
      if (__indexOf.call(_directionsValues.DESC, direction) >= 0) {
        return 'DESC';
      }
      return 'ASC';
    };
    _parseOne = function(field, direction) {
      var parsedDirection;
      parsedDirection = _parseDirection(direction);
      return {
        field: field.trim(),
        direction: parsedDirection
      };
    };
    _parseOneFromString = function(orderBy) {
      var direction, field, _ref;
      _ref = orderBy.trim().split(' '), field = _ref[0], direction = _ref[1];
      return _parseOne(field, direction);
    };
    _parseArray = function(orderBys) {
      var orderBy, parsed, result, _i, _len;
      result = {};
      for (_i = 0, _len = orderBys.length; _i < _len; _i++) {
        orderBy = orderBys[_i];
        parsed = _parseOneFromString(orderBy);
        result[parsed.field] = parsed.direction;
      }
      return result;
    };
    _parseObject = function(orderBys) {
      var direction, field, parsed, result;
      result = {};
      for (field in orderBys) {
        direction = orderBys[field];
        parsed = _parseOne(field, direction);
        result[parsed.field] = parsed.direction;
      }
      return result;
    };
    return parse = function(orderBys) {
      var orderBy;
      if (orderBys.length > 1) {
        return _parseArray(orderBys);
      }
      orderBy = orderBys[0];
      if (typeof orderBy === 'string') {
        return _parseArray(orderBy.split(','));
      }
      return _parseObject(orderBy);
    };
  });

}).call(this);
