(function() {
  'use strict';
  var __slice = [].slice;

  define(['./wak-url-builder', './orderby-parser'], function(UrlBuilder, _parseOrderBy) {
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
