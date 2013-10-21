(function() {
  'use strict';
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['helpers', 'backbone'], function(helpers) {
    var _createDef, _deleteProperties, _fieldsToRemove, _send;
    _deleteProperties = function(data) {
      var key, val, _results;
      _results = [];
      for (key in data) {
        val = data[key];
        if (typeof val === 'object') {
          _results.push(_deleteProperties(val));
        } else if (__indexOf.call(_send.propertiesToDelete, key) >= 0) {
          _results.push(delete data[key]);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    _send = function(model, data, action, options) {
      var newOptions;
      _deleteProperties(data);
      data = JSON.stringify(data);
      newOptions = {
        type: action.verb,
        url: model.urlRoot + '/?$method=' + action.wakMethod,
        data: data,
        dataType: 'json',
        contentType: 'application/json'
      };
      return $.ajax($.extend({}, options, newOptions));
    };
    _send.PUT = {
      verb: 'POST',
      wakMethod: 'update'
    };
    _send.propertiesToDelete = ['uri'];
    _fieldsToRemove = ['__entityModel', '__KEY', '__STAMP', 'id', 'ID', 'uri'];
    _createDef = function(dataClass, catalog) {
      return {
        constructor: function(options, collection) {
          if (options.id == null) {
            options.id = options.ID;
          }
          return Backbone.Model.prototype.constructor.apply(this, arguments);
        },
        parse: function(response) {
          var attr, data, key, value;
          data = {};
          for (key in response) {
            value = response[key];
            if (__indexOf.call(_fieldsToRemove, key) >= 0) {
              continue;
            }
            attr = dataClass.attr(key);
            data[key] = attr.fromRaw(value);
          }
          data.$stamp = response.__STAMP;
          data.id = response.ID;
          return data;
        },
        urlRoot: dataClass.dataURI,
        url: function() {
          return this.urlRoot + '(' + this.id + ')';
        },
        sync: function(method, model, options) {
          var data, def;
          if (method === 'read') {
            return Backbone.Model.prototype.sync.apply(this, arguments);
          }
          helpers.throwIf(method !== 'update', "method " + method + " not supported yet");
          data = model.changedAttributes();
          if (!data) {
            return helpers.resolvedPromise();
          }
          data.__KEY = model.id;
          data.__STAMP = model.get('$stamp');
          def = $.Deferred();
          _send(model, data, _send.PUT, options).done(function(data) {
            if (typeof options.success === "function") {
              options.success(data, true);
            }
            return def.resolve();
          }).fail(function(response) {
            var errors;
            data = response.responseJSON;
            errors = data != null ? data.__ERROR : void 0;
            if (typeof options.error === "function") {
              options.error(data, errors);
            }
            model.set('$errors', errors);
            return def.reject(errors);
          });
          return def;
        }
      };
    };
    return {
      create: function(dataClass, catalog) {
        var Model, definition;
        definition = _createDef(dataClass, catalog);
        Model = Backbone.Model.extend(definition);
        Model.className = dataClass.className;
        Model.catalog = catalog;
        return Model;
      }
    };
  });

}).call(this);
