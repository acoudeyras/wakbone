(function() {
  'use strict';
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define([], function() {
    var ModelSerializer, _fieldsToRemove, _removePropertiesNotInDataclass;
    _fieldsToRemove = ['__entityModel', '__KEY', '__STAMP', 'id', 'ID', 'uri'];
    _removePropertiesNotInDataclass = function(data, dataClass, attrNames) {
      var key, val, _results;
      if (attrNames == null) {
        attrNames = _.pluck(dataClass.attr(), 'name');
      }
      _results = [];
      for (key in data) {
        val = data[key];
        if (typeof val === 'object') {
          _results.push(_removePropertiesNotInDataclass(val, dataClass, attrNames));
        } else if (__indexOf.call(attrNames, key) < 0) {
          _results.push(delete data[key]);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    return ModelSerializer = (function() {
      function ModelSerializer(model) {
        this.model = model;
        this.dataClass = this.model.dataClass;
      }

      ModelSerializer.prototype.toJSON = function() {
        var data;
        data = this.model.changedAttributes();
        if (!data) {
          return null;
        }
        data.__KEY = this.model.id;
        data.__STAMP = this.model.get('$stamp');
        _removePropertiesNotInDataclass(data, this.dataClass);
        return JSON.stringify(data);
      };

      ModelSerializer.prototype.fromJSON = function(data) {
        var attr, key, result, value;
        result = {};
        for (key in data) {
          value = data[key];
          if (__indexOf.call(_fieldsToRemove, key) >= 0) {
            continue;
          }
          attr = this.dataClass.attr(key);
          result[key] = attr.fromRaw(value);
        }
        result.$stamp = data.__STAMP;
        result.id = data.ID;
        return result;
      };

      return ModelSerializer;

    })();
  });

}).call(this);
