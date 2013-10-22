(function() {
  'use strict';
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['backbone'], function() {
    var ModelSerializer, _fieldsToRemove;
    _fieldsToRemove = ['__entityModel', '__KEY', '__STAMP', 'id', 'ID', 'uri'];
    return ModelSerializer = (function() {
      function ModelSerializer(model) {
        this.model = model;
        this.dataClass = this.model.dataClass;
      }

      ModelSerializer.prototype.toJSON = function() {
        var data, json;
        data = this.model.attributes;
        if (!data) {
          return null;
        }
        json = this.model.toJSON();
        return JSON.stringify(json);
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
