(function() {
  'use strict';
  define(['./wak-model', './wak-collection', './attribute', './helpers', './check', 'backbone'], function(wakModelFactory, wakCollectionFactory, Attribute, helpers, check) {
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
        Model = wakModelFactory.create(dataClass, this);
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
