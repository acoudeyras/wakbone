(function() {
  'use strict';
  var __slice = [].slice;

  define(['./rest-query', './orderby-parser'], function(RestQuery, _parseOrderBy) {
    var QueryState;
    return QueryState = (function() {
      function QueryState(collection, rootUrl, originState) {
        this.collection = collection;
        this.rootUrl = rootUrl;
        this.originState = originState;
        this.state = _.extend(QueryState["default"], originState);
        this._query = new RestQuery(this.rootUrl);
      }

      QueryState.prototype.filter = function(fieldName, val, op) {};

      QueryState.prototype.orderBy = function() {
        var orderBys, parsedOrderBys;
        orderBys = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        parsedOrderBys = _parseOrderBy(orderBys);
        this._query.orderBy(parsedOrderBys);
        this._orderBy = parsedOrderBys;
        return this;
      };

      QueryState.prototype.select = function() {};

      QueryState.prototype.skip = function(skip) {
        this.state.skip = skip;
        this._query.skip(skip);
        return this;
      };

      QueryState.prototype.limit = function(limit) {
        this.state.limit = limit;
        this._query.limit(limit);
        return this;
      };

      QueryState.prototype.expand = function(expand) {};

      QueryState.prototype.clear = function() {
        this.state = _.extend(QueryState["default"], this.originState);
        return this._query = new RestQuery(this.rootUrl);
      };

      QueryState.prototype.url = function() {
        return this._query.url;
      };

      QueryState["default"] = {
        skip: 0,
        limit: 100
      };

      return QueryState;

    })();
  });

}).call(this);
