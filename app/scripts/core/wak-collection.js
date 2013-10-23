(function() {
  define(['./query-state', 'backbone'], function(QueryState) {
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
