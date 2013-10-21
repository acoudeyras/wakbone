(function() {
  'use strict';
  define(['backbone'], function() {
    var QueryState, _createDef;
    QueryState = (function() {
      function QueryState(col) {
        this.col = col;
      }

      QueryState.prototype.filter = function(fieldName, val, op) {};

      QueryState.prototype.orderBy = function() {};

      QueryState.prototype.top = function(top) {
        this._top = top;
        return this;
      };

      QueryState.prototype.limit = function(limit) {
        this._limit = limit;
        return this;
      };

      QueryState.prototype.expand = function(expand) {};

      return QueryState;

    })();
    _createDef = function(dataClass, model, catalog) {
      return {
        constructor: function() {
          this.$state = new QueryState(this);
          return Backbone.Collection.prototype.constructor.apply(this, arguments);
        },
        url: dataClass.dataURI,
        className: dataClass.className,
        collectionName: dataClass.collectionName,
        catalog: catalog,
        model: model,
        parse: function(response) {
          this.$total = response.__COUNT;
          return response.__ENTITIES;
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
        return Collection;
      }
    };
  });

}).call(this);
