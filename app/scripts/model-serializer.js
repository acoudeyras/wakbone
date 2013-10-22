(function() {
  'use strict';
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['backbone'], function() {
    var ModelSerializer, _fieldsToRemove, _removePropertiesNotInDataclass;
    _fieldsToRemove = ['__entityModel', '__KEY', '__STAMP', 'id', 'ID', 'uri'];
    _removePropertiesNotInDataclass = function(data, dataClass, attrNames, alreadyVisited) {
      var key, result, val;
      if (alreadyVisited == null) {
        alreadyVisited = [];
      }
      if (attrNames == null) {
        attrNames = _.pluck(dataClass.attr(), 'name');
      }
      result = {};
      for (key in data) {
        val = data[key];
        if (__indexOf.call(attrNames, key) < 0) {
          continue;
        }
        if (val instanceof Backbone.Model || val instanceof Backbone.Collection) {
          if (typeof val === 'object' && __indexOf.call(alreadyVisited, val) < 0) {
            alreadyVisited.push(val);
            result[key](_removePropertiesNotInDataclass(val, dataClass, attrNames, alreadyVisited));
          }
        } else {
          result[key] = val;
        }
      }
      return result;
    };
    return ModelSerializer = (function() {
      function ModelSerializer(model) {
        this.model = model;
        this.dataClass = this.model.dataClass;
      }

      ModelSerializer.prototype.changesToJSON = function() {
        return this.toJSON(this.model.changedAttributes());
      };

      ModelSerializer.prototype.allToJSON = function() {
        return this.toJSON(this.model.attributes);
      };

      ModelSerializer.prototype.toJSON = function(data) {
        var json;
        if (!data) {
          return null;
        }
        json = this.model.toJSON();
        data.__KEY = this.model.id;
        console.log(this.model.get('$stamp'));
        data.__STAMP = this.model.get('$stamp');
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
