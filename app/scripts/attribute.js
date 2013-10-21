(function() {
  'use strict';
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['./types', './wak-collection', './helpers'], function(types, wakCollectionFactory, helpers) {
    var Attribute;
    return Attribute = (function() {
      function Attribute(_arg, dataClass) {
        var _ref;
        this.identifying = _arg.identifying, this.indexed = _arg.indexed, this.kind = _arg.kind, this.name = _arg.name, this.scope = _arg.scope, this.type = _arg.type, this.path = _arg.path;
        this.dataClass = dataClass;
        if (this.identifying == null) {
          this.identifying = false;
        }
        this.isRaw = (_ref = this.kind, __indexOf.call(Attribute.rawKinds, _ref) >= 0);
        this.catalog = this.dataClass.catalog;
        if (this.isRaw) {
          this.typeExtra = types[this.type];
          if (this.typeExtra == null) {
            throw new Error('type ' + this.type + ' not supported');
          }
        }
        /*
        need to be lazy, because when we load the attributes, the catalog may not have yet loaded
        the relatedModel. We could have added a "build" method that would have done that and be called
        by the catalog after all model are loaded, but i thought it was overdesign yet
        */

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
        id = value.__deferred.__KEY;
        return new this.RelatedModel({
          id: id
        });
      };

      Attribute.prototype._convertToRelatedCollection = function(value) {
        var newCollection, url;
        if (value === null) {
          return null;
        }
        url = value.__deferred.uri;
        newCollection = wakCollectionFactory.createRelated(this.RelatedCollection, url);
        return new newCollection();
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

      return Attribute;

    })();
  });

}).call(this);
