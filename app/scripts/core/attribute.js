(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['./types', './wak-collection', './helpers'], function(types, wakCollectionFactory, helpers) {
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

      Attribute.lazyval('relatedDataClass', function() {
        var dataClass, name, _ref;
        if ((_ref = this.kind) !== 'relatedEntity' && _ref !== 'relatedEntities') {
          return null;
        }
        if (this.kind === 'relatedEntity') {
          name = this.catalog.constructor.classNameInCatalog(this.type);
          dataClass = this.catalog[name];
        } else {
          dataClass = this.catalog.$entryFromCollectionName(this.type);
        }
        return dataClass;
      });

      Attribute.lazyval('RelatedModel', function() {
        if (this.kind !== 'relatedEntity') {
          return null;
        }
        return this.relatedDataClass.Model;
      });

      Attribute.lazyval('RelatedCollection', function() {
        if (this.kind !== 'relatedEntities') {
          return null;
        }
        return this.relatedDataClass.Collection;
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
