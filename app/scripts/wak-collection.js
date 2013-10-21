(function() {
  'use strict';
  define(['./rest-query', 'backbone'], function(RestQuery) {
    var QueryState, _createDef;
    QueryState = (function() {
      function QueryState(collection, state) {
        this.collection = collection;
        this.state = _.extend(QueryState["default"], state);
      }

      QueryState.prototype.filter = function(fieldName, val, op) {};

      QueryState.prototype.orderBy = function() {};

      QueryState.prototype.skip = function(skip) {
        this.state.skip = skip;
        return this;
      };

      QueryState.prototype.limit = function(limit) {
        this.state.limit = limit;
        return this;
      };

      QueryState.prototype.expand = function(expand) {};

      QueryState.prototype.url = function() {
        var query;
        query = new RestQuery(this.collection.url);
        query.skip(this.state.top);
        return query.url;
      };

      QueryState["default"] = {
        skip: 0,
        limit: 100
      };

      return QueryState;

    })();
    _createDef = function(dataClass, model, catalog) {
      return {
        constructor: function() {
          this.query = new QueryState(this);
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
        },
        fetch: function() {
          var url;
          url = this.query.url();
          console.log(url);
          return Backbone.Collection.prototype.fetch.apply(this, arguments);
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
