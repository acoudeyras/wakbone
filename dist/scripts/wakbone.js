(function () {
(function() {
  define('core/underscore-ext',['underscore.string'], function(_str) {
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

(function() {
  define('core/helpers',['./underscore-ext', 'moment'], function(_ext, moment) {
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
      rejectedPromise: function(value) {
        var def;
        def = $.Deferred();
        def.reject(value);
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

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  define('core/check',[], function() {
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

(function() {
  var __slice = [].slice;

  define('core/wak-url-builder',['./helpers', './check'], function(helpers, check) {
    var UrlBuilder, WakUrlBuilder, _computedKeywords, _protect;
    _protect = function(str) {
      return '"' + str + '"';
    };
    UrlBuilder = (function() {
      function UrlBuilder(root) {
        this.root = root;
        this._queryParams = {};
        this._pathParams = [];
      }

      UrlBuilder.prototype.query = function(name, value) {
        return this._queryParams[name] = value;
      };

      UrlBuilder.prototype.path = function(name) {
        return this._pathParams.push(name);
      };

      UrlBuilder.prototype.clearQuery = function() {
        return this._queryParams = {};
      };

      UrlBuilder.prototype.clearPath = function() {
        return this._pathParams = [];
      };

      UrlBuilder.prototype.buildPathParams = function() {
        if (!this._pathParams.length) {
          return '';
        }
        return '/' + this._pathParams.join('/');
      };

      UrlBuilder.prototype.buildQueryParams = function() {
        var params,
          _this = this;
        params = Object.keys(this._queryParams);
        if (!params.length) {
          return '';
        }
        params = params.map(function(name) {
          return name + '=' + _this._queryParams[name];
        });
        return '?' + params.join('&');
      };

      UrlBuilder.prototype.build = function() {
        return this.root + this.buildPathParams() + this.buildQueryParams();
      };

      return UrlBuilder;

    })();
    _computedKeywords = ['$all', 'count', 'average', 'min', 'max', 'sum'];
    return WakUrlBuilder = (function() {
      function WakUrlBuilder(root) {
        this.root = root;
        check(this.root).notNull().isString().notEmpty();
        this.urlBuilder = new UrlBuilder(this.root);
      }

      WakUrlBuilder.prototype.key = function(key) {
        this.urlBuilder = new UrlBuilder(this.root + '(' + key + ')');
        return this;
      };

      WakUrlBuilder.prototype.select = function() {
        var properties;
        properties = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        this.urlBuilder.path(properties.join(','));
        return this;
      };

      WakUrlBuilder.prototype._numParam = function(num, queryParamName) {
        var castedNum;
        castedNum = parseInt(num, 10);
        if (castedNum !== castedNum) {
          helpers.log('bad ' + queryParamName + ' parameter: ' + num);
          return this;
        }
        this.urlBuilder.query('$' + queryParamName, castedNum);
        return this;
      };

      WakUrlBuilder.prototype.clearSelect = function() {
        this.urlBuilder.clearPath();
        return this;
      };

      WakUrlBuilder.prototype.limit = function(num) {
        return this._numParam(num, 'limit');
      };

      WakUrlBuilder.prototype.skip = function(num) {
        return this._numParam(num, 'skip');
      };

      WakUrlBuilder.prototype.timeout = function(num) {
        return this._numParam(num, 'timeout');
      };

      WakUrlBuilder.prototype.expand = function() {
        var expanded;
        expanded = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        expanded = expanded.join(',');
        this.urlBuilder.query('$expand', expanded);
        return this;
      };

      WakUrlBuilder.prototype.where = function(clause) {
        this.urlBuilder.query('$filter', _protect(clause));
        return this;
      };

      WakUrlBuilder.prototype.orderBy = function(clause) {
        var direction, field, orderBys;
        orderBys = (function() {
          var _results;
          _results = [];
          for (field in clause) {
            direction = clause[field];
            _results.push(field + ' ' + direction);
          }
          return _results;
        })();
        this.urlBuilder.query('$orderby', orderBys.join(','));
        return this;
      };

      WakUrlBuilder.prototype.distinct = function(property) {
        this.urlBuilder.clearPath();
        this.select(property);
        this.urlBuilder.query('$distinct', 'true');
        return this;
      };

      WakUrlBuilder.prototype.compute = function(property, keyword) {
        if (keyword == null) {
          keyword = '$all';
        }
        check(keyword)["in"](_computedKeywords);
        this.urlBuilder.clearPath();
        this.select(property);
        this.urlBuilder.query('$compute', keyword);
        return this;
      };

      WakUrlBuilder.getter('url', function() {
        return this.urlBuilder.build();
      });

      return WakUrlBuilder;

    })();
  });

}).call(this);

(function() {
  define('core/backbone-walker',[], function() {
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
    _read = function(expression, separator) {
      var parts, remaining, val;
      parts = expression.split(separator);
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
          return Backbone.Model.prototype.get.call(found.model, found.property);
        };
        return found;
      };

      return BackboneWalker;

    })();
  });

}).call(this);

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define('core/model-serializer',['backbone'], function() {
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

(function() {
  var __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define('core/wak-model',['./wak-url-builder', './backbone-walker', './helpers', './model-serializer', 'backbone'], function(UrlBuilder, BackboneWalker, helpers, ModelSerializer) {
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
            if (attr.readOnly) {
              continue;
            }
            if (value == null) {
              result[key] = null;
              continue;
            }
            if (value instanceof Backbone.Collection) {
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

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define('core/orderby-parser',[], function() {
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

(function() {
  var __slice = [].slice;

  define('core/query-state',['./wak-url-builder', './orderby-parser'], function(UrlBuilder, _parseOrderBy) {
    var QueryState, _isSubProperty;
    _isSubProperty = function(property) {
      return property.indexOf('.') !== -1;
    };
    return QueryState = (function() {
      function QueryState(collection, rootUrl, originState) {
        this.collection = collection;
        this.rootUrl = rootUrl;
        this.originState = originState;
        this.state = _.extend(QueryState["default"], this.originState);
        this._urlBuilder = new UrlBuilder(this.rootUrl);
      }

      QueryState.prototype.where = function(filterClause) {
        this.state.where = filterClause;
        this._urlBuilder.where(filterClause);
        return this;
      };

      QueryState.prototype.orderBy = function() {
        var orderBys, parsedOrderBys;
        orderBys = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        parsedOrderBys = _parseOrderBy(orderBys);
        this.state.orderBy = parsedOrderBys;
        this._urlBuilder.orderBy(parsedOrderBys);
        return this;
      };

      QueryState.prototype.select = function() {
        var expandsNeeded, selected, selecteds;
        selecteds = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        this.state.select = selecteds;
        expandsNeeded = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = selecteds.length; _i < _len; _i++) {
            selected = selecteds[_i];
            if (_isSubProperty(selected)) {
              _results.push(selected.split('.')[0]);
            }
          }
          return _results;
        })();
        if (expandsNeeded.length) {
          this.expand(expandsNeeded);
        }
        this._urlBuilder.select(selecteds);
        return this;
      };

      QueryState.prototype.skip = function(skip) {
        this.state.skip = skip;
        this._urlBuilder.skip(skip);
        return this;
      };

      QueryState.prototype.limit = function(limit) {
        this.state.limit = limit;
        this._urlBuilder.limit(limit);
        return this;
      };

      QueryState.prototype.expand = function() {
        var expands;
        expands = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        this.state.expands = expands;
        this._urlBuilder.expand(expands);
        return this;
      };

      QueryState.prototype.clear = function() {
        this.state = _.extend(QueryState["default"], this.originState);
        return this._urlBuilder = new UrlBuilder(this.rootUrl);
      };

      QueryState.prototype.url = function() {
        return this._urlBuilder.url;
      };

      QueryState["default"] = {
        skip: 0,
        limit: 100
      };

      return QueryState;

    })();
  });

}).call(this);

(function() {
  define('core/wak-collection',['./query-state', 'backbone'], function(QueryState) {
    var _createDef;
    _createDef = function(dataClass, model, catalog) {
      return {
        constructor: function() {
          this.query = new QueryState(this, dataClass.dataURI);
          return Backbone.Collection.prototype.constructor.apply(this, arguments);
        },
        dataClass: dataClass,
        catalog: catalog,
        model: model,
        toJSON: function() {
          if (this.models.length === 0) {
            return void 0;
          }
          return this.models.map(function(model) {
            return model.toJSON();
          });
        },
        parse: function(response) {
          this.$total = response.__COUNT;
          return response.__ENTITIES;
        },
        url: function() {
          return this.query.url();
        }
      };
    };
    return {
      createRelated: function(Collection, url) {
        return Collection.extend({
          url: url + '&$method=subentityset'
        });
      },
      create: function(dataClass, model, catalog) {
        var Collection, definition;
        definition = _createDef(dataClass, model, catalog);
        Collection = Backbone.Collection.extend(definition);
        Collection.dataClass = dataClass;
        Collection.catalog = catalog;
        return Collection;
      }
    };
  });

}).call(this);

(function() {
  define('core/types',['./helpers'], function(helpers) {
    var _asItCome, _types;
    _asItCome = function(value) {
      return value;
    };
    return _types = {
      string: {
        fromRaw: _asItCome,
        toRaw: _asItCome
      },
      number: {
        fromRaw: _asItCome,
        toRaw: _asItCome
      },
      long: {
        fromRaw: _asItCome,
        toRaw: _asItCome
      },
      date: {
        fromRaw: function(value) {
          return moment(value, moment.wakFormat);
        },
        toRaw: _asItCome
      },
      image: {
        fromRaw: _asItCome,
        toRaw: _asItCome
      }
    };
  });

}).call(this);

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define('core/attribute',['./types', './wak-collection', './helpers'], function(types, wakCollectionFactory, helpers) {
    var Attribute;
    return Attribute = (function() {
      function Attribute(_arg, dataClass) {
        var _ref, _ref1, _ref2;
        this.identifying = _arg.identifying, this.indexed = _arg.indexed, this.kind = _arg.kind, this.name = _arg.name, this.scope = _arg.scope, this.type = _arg.type, this.path = _arg.path;
        this.dataClass = dataClass;
        if (this.identifying == null) {
          this.identifying = false;
        }
        this.isRaw = (_ref = this.kind, __indexOf.call(Attribute.rawKinds, _ref) >= 0);
        this.readOnly = (_ref1 = this.kind, __indexOf.call(Attribute.readOnlyKinds, _ref1) >= 0) || (_ref2 = this.type, __indexOf.call(Attribute.readOnlyTypes, _ref2) >= 0);
        this.catalog = this.dataClass.catalog;
        if (this.isRaw) {
          this.typeExtra = types[this.type];
          if (this.typeExtra == null) {
            throw new Error('type ' + this.type + ' not supported');
          }
        }
      }

      Attribute.lazyval('RelatedModel', function() {
        var name;
        if (this.kind !== 'relatedEntity') {
          return null;
        }
        name = this.catalog.constructor.classNameInCatalog(this.type);
        return this.catalog[name].Model;
      });

      Attribute.lazyval('RelatedCollection', function() {
        var dataClass;
        if (this.kind !== 'relatedEntities') {
          return null;
        }
        dataClass = this.catalog.$entryFromCollectionName(this.type);
        return dataClass.Collection;
      });

      Attribute.prototype._convertToRelatedModel = function(value) {
        var id;
        if (value === null) {
          return null;
        }
        if (value.__deferred != null) {
          id = value.__deferred.__KEY;
          return new this.RelatedModel({
            id: id
          });
        } else {
          return new this.RelatedModel(value);
        }
      };

      Attribute.prototype._convertToRelatedCollection = function(value) {
        var RelatedCol, collection, url, _ref, _ref1;
        if (value === null) {
          return null;
        }
        url = (_ref = value.__deferred) != null ? _ref.uri : void 0;
        RelatedCol = wakCollectionFactory.createRelated(this.RelatedCollection, url);
        collection = new RelatedCol();
        if (((_ref1 = value.__ENTITIES) != null ? _ref1.length : void 0) > 0) {
          collection.set(value, {
            parse: true
          });
        }
        return collection;
      };

      Attribute.prototype.fromRaw = function(value) {
        if (this.typeExtra != null) {
          return this.typeExtra.fromRaw(value);
        }
        if (this.kind === 'relatedEntity') {
          return this._convertToRelatedModel(value);
        }
        if (this.kind === 'relatedEntities') {
          return this._convertToRelatedCollection(value);
        }
        return console.log('oups');
      };

      Attribute.prototype.toRaw = function(value) {};

      Attribute.rawKinds = ['storage', 'alias', 'calculated'];

      Attribute.readOnlyKinds = ['calculated', 'alias'];

      Attribute.readOnlyTypes = ['image'];

      return Attribute;

    })();
  });

}).call(this);

(function() {
  define('core/http-requester',['./model-serializer', './helpers', 'backbone'], function(ModelSerializer, helpers) {
    var HttpRequester, _defaultAjaxOptions, _finalOptions;
    _defaultAjaxOptions = {
      dataType: 'json',
      contentType: 'application/json'
    };
    _finalOptions = function(httpRequesterOptions, callerOptions) {
      return $.extend({}, httpRequesterOptions, callerOptions, _defaultAjaxOptions);
    };
    return HttpRequester = (function() {
      function HttpRequester() {}

      HttpRequester.prototype.read = function(model, options) {
        return Backbone.Model.prototype.sync.apply(model, ['read', model, options]);
      };

      HttpRequester.prototype.upsert = function(model, options) {
        var data, ex, methodOptions, url;
        try {
          data = new ModelSerializer(model).toJSON();
        } catch (_error) {
          ex = _error;
          return helpers.rejectedPromise(ex.message);
        }
        if (data == null) {
          return helpers.resolvedPromise();
        }
        url = model.url() + '/?$method=update';
        methodOptions = {
          url: url,
          data: data,
          type: 'POST'
        };
        return $.ajax(_finalOptions(methodOptions, options));
      };

      HttpRequester.prototype.create = function(model, options) {
        return this.upsert(model, options);
      };

      HttpRequester.prototype.update = function(model, options) {
        return this.upsert(model, options);
      };

      HttpRequester.prototype["delete"] = function(model, options) {
        var methodOptions, url;
        url = model.url() + '/?$method=delete';
        methodOptions = {
          url: url,
          type: 'POST'
        };
        return $.ajax(_finalOptions(methodOptions, options));
      };

      return HttpRequester;

    })();
  });

}).call(this);

(function() {
  define('core/catalog',['./wak-model', './wak-collection', './attribute', './http-requester', './helpers', './check', 'backbone'], function(wakModelFactory, wakCollectionFactory, Attribute, HttpRequester, helpers, check) {
    var Catalog, DataClass;
    DataClass = (function() {
      function DataClass(_arg, catalog) {
        var attributes,
          _this = this;
        this.className = _arg.className, this.collectionName = _arg.collectionName, this.dataURI = _arg.dataURI, attributes = _arg.attributes;
        this.catalog = catalog;
        this._attributes = attributes.map(function(attr) {
          return new Attribute(attr, _this);
        });
        this._attributesByName = _.indexBy(this._attributes, 'name');
      }

      DataClass.prototype.finalize = function(Collection, Model) {
        this.Collection = Collection;
        this.Model = Model;
        return this.entities = new this.Collection();
      };

      DataClass.prototype.attr = function(name) {
        if (name == null) {
          return this._attributes;
        }
        return this._attributesByName[name];
      };

      return DataClass;

    })();
    return Catalog = (function() {
      function Catalog(data) {
        var entryName, rawDataClass, _i, _len, _ref;
        this.$classNames = [];
        this.$dataLoader = new HttpRequester();
        this._colsByEntryName = {};
        _ref = data.dataClasses;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          rawDataClass = _ref[_i];
          entryName = Catalog.classNameInCatalog(rawDataClass.className);
          this.$classNames.push(entryName);
          helpers.throwIf(this[entryName] != null, "conflict in catalog with dataclass " + entryName);
          this._colsByEntryName[rawDataClass.collectionName] = entryName;
          this._addEntry(entryName, rawDataClass);
        }
      }

      Catalog.prototype.$entryFromCollectionName = function(collectionName) {
        var entryName;
        entryName = this._colsByEntryName[collectionName];
        return this[entryName];
      };

      Catalog.prototype._addEntry = function(entryName, rawDataClass) {
        var Collection, Model, dataClass;
        dataClass = new DataClass(rawDataClass, this);
        Model = wakModelFactory.create(dataClass, this, this.$dataLoader);
        Collection = wakCollectionFactory.create(dataClass, Model, this);
        dataClass.finalize(Collection, Model);
        return this[entryName] = dataClass;
      };

      Catalog.classNameInCatalog = function(className) {
        return _.lowerCamelize(className);
      };

      Catalog.load = function(success) {
        return $.ajax('/rest/$catalog/$all').then(function(data) {
          return new Catalog(data);
        });
      };

      return Catalog;

    })();
  });

}).call(this);

(function() {
  require.config({
    paths: {
      jquery: '../bower_components/jquery/jquery',
      underscore: '../bower_components/underscore/underscore',
      backbone: '../bower_components/backbone/backbone',
      'underscore.string': '../bower_components/underscore.string/dist/underscore.string.min',
      moment: '../bower_components/moment/moment'
    },
    shim: {
      backbone: {
        deps: ['underscore', 'jquery']
      },
      'underscore.string': {
        deps: ['underscore']
      }
    }
  });

  define('wakbone',['./core/catalog'], function(Catalog) {
    return Catalog;
  });

}).call(this);
}());