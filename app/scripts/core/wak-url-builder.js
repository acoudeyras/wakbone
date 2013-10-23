(function() {
  var __slice = [].slice;

  define(['./helpers', './check'], function(helpers, check) {
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
