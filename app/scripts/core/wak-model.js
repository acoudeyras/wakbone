(function() {
  var __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['./wak-url-builder', './backbone-walker', './helpers', './model-serializer', 'backbone'], function(UrlBuilder, BackboneWalker, helpers, ModelSerializer) {
    var _createDef, _fieldsToRemove;
    _fieldsToRemove = ['__entityModel', '__KEY', '__STAMP', 'id', 'ID', 'uri'];
    _createDef = function(dataClass, catalog, dataloader) {
      return {
        constructor: function(options, collection) {
          if (options == null) {
            options = {};
          }
          if (options.id == null) {
            options.id = options.ID;
          }
          this._urlBuilder = new UrlBuilder(this.urlRoot);
          if (options.id != null) {
            this._urlBuilder.key(options.id);
          }
          this.walker = new BackboneWalker(this);
          return Backbone.Model.prototype.constructor.apply(this, arguments);
        },
        dataClass: dataClass,
        dataloader: dataloader,
        catalog: catalog,
        expand: function() {
          var expanded;
          expanded = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          this._expanded = this._urlBuilder.expand(expanded);
          return this;
        },
        walk: function(expression) {
          return this.walker.walk(expression);
        },
        get: function(expression) {
          return this.walk(expression).val();
        },
        set: function(expression, value) {
          var model, property, _ref;
          if (typeof expression === 'object') {
            if (expression.id != null) {
              this._urlBuilder.key(expression.id);
            }
            return Backbone.Model.prototype.set.apply(this, arguments);
          }
          if (expression === 'id') {
            this._urlBuilder.key(value);
          }
          _ref = this.walk(expression), model = _ref.model, property = _ref.property;
          return Backbone.Model.prototype.set.call(model, property, value);
        },
        toJSON: function() {
          var attr, attrNames, key, result, value, _addToResultIfExist, _ref,
            _this = this;
          _addToResultIfExist = function(propName, key) {
            var val;
            val = _this.get(propName);
            if (val != null) {
              return result[key] = val;
            }
          };
          result = {};
          attrNames = _.pluck(dataClass.attr(), 'name');
          _ref = this.attributes;
          for (key in _ref) {
            value = _ref[key];
            if (__indexOf.call(attrNames, key) < 0) {
              continue;
            }
            attr = dataClass.attr(key);
            if (value == null) {
              result[key] = null;
              continue;
            }
            if (value instanceof Backbone.Collection) {
              result[key] = value.toJSON();
              continue;
            }
            if (value instanceof Backbone.Model) {
              if (value.isNew()) {
                throw new Error('You must first save a entity before making it related to another');
              }
              result[key] = {
                __KEY: value.get('id')
              };
              continue;
            }
            if (typeof value.toJSON === 'function') {
              value = value.toJSON();
              if (value !== void 0) {
                result[key] = value;
              }
              continue;
            }
            result[key] = value;
          }
          _addToResultIfExist('$stamp', '__STAMP');
          _addToResultIfExist('id', '__KEY');
          return result;
        },
        parse: function(response) {
          var serializer;
          serializer = new ModelSerializer(this);
          return serializer.fromJSON(response);
        },
        urlRoot: dataClass.dataURI,
        url: function() {
          return this._urlBuilder.url;
        },
        sync: function(method, model, options) {
          var def;
          def = $.Deferred();
          this.dataloader[method](model, options).done(function(data) {
            if (typeof options.success === "function") {
              options.success(data, true);
            }
            return def.resolve();
          }).fail(function(response) {
            var data, errors;
            data = response.responseJSON;
            errors = data != null ? data.__ERROR : void 0;
            if (typeof options.error === "function") {
              options.error(data, errors);
            }
            model.set('$errors', errors);
            return def.reject(errors);
          });
          return def.promise();
        }
      };
    };
    return {
      create: function(dataClass, catalog, dataloader) {
        var Model, definition;
        definition = _createDef(dataClass, catalog, dataloader);
        Model = Backbone.Model.extend(definition);
        Model.catalog = catalog;
        Model.dataClass = dataClass;
        return Model;
      }
    };
  });

}).call(this);
