(function() {
  'use strict';
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define([], function() {
    var FilterClause, QueryBuilder;
    FilterClause = (function() {
      function FilterClause(_arg) {
        this.name = _arg.name, this.val = _arg.val, this.op = _arg.op, this.attr = _arg.attr;
      }

      FilterClause.prototype._buildField = function() {
        var _ref;
        if ((_ref = this.attr.kind) === 'relatedEntity') {
          return this.name + '.ID';
        } else {
          return this.name;
        }
      };

      FilterClause.prototype._tryFindOpInVal = function(nbchar) {
        var _ref;
        if (_ref = this.val.substring(0, nbchar), __indexOf.call(FilterClause.operators, _ref) >= 0) {
          return {
            op: this.val.substring(0, nbchar),
            nbchar: nbchar
          };
        } else {
          return null;
        }
      };

      FilterClause.prototype.operatorInVal = function() {
        var found;
        found = this._tryFindOpInVal(2);
        if (found != null) {
          return found;
        }
        found = this._tryFindOpInVal(1);
        if (found == null) {
          return null;
        }
        if (found.op !== '!') {
          return found;
        }
        return {
          op: '!=',
          nbchar: 1
        };
      };

      FilterClause.prototype._buildValue = function() {
        var opInVal, val;
        val = this.val;
        opInVal = this.operatorInVal();
        if (opInVal != null) {
          val = val.substring(opInVal.nbchar, val.length);
        }
        if (this.attr.type === 'string') {
          return "'" + val + "'";
        } else {
          return val;
        }
      };

      FilterClause.prototype._buildOp = function() {
        var opInVal;
        if (this.op != null) {
          return this.op;
        }
        opInVal = this.operatorInVal();
        if (opInVal != null) {
          return opInVal.op;
        }
        if (this.attr.identifying) {
          return '=';
        }
        if (this.attr.type === 'string') {
          return ' begin ';
        }
        return '=';
      };

      FilterClause.prototype.isEmpty = function() {
        return this.val === null || this.val.trim() === '';
      };

      FilterClause.prototype.build = function() {
        return this._buildField() + this._buildOp() + this._buildValue();
      };

      FilterClause.operators = ['<', '>', '=', '!', '!=', '>=', '<='];

      return FilterClause;

    })();
    return QueryBuilder = (function() {
      function QueryBuilder(def) {
        this.def = def;
        this.queryArgs = {};
      }

      QueryBuilder.prototype.isEmpty = function() {
        return Object.keys(this.queryArgs).length === 0;
      };

      QueryBuilder.prototype.contains = function(name) {
        return this.queryArgs[name] != null;
      };

      QueryBuilder.prototype.getClause = function(name) {
        return this.queryArgs[name];
      };

      QueryBuilder.prototype.attr = function(name) {
        return _.find(this.def.attributes, function(attr) {
          return attr.name === name;
        });
      };

      QueryBuilder.prototype.add = function(fieldName, val, op) {
        var clause;
        if (this.attr(fieldName) === null) {
          debugger;
        }
        clause = new FilterClause({
          name: fieldName,
          op: op,
          val: val,
          attr: this.attr(fieldName)
        });
        if (clause.isEmpty()) {
          delete this.queryArgs[clause.name];
        } else {
          this.queryArgs[clause.name] = clause;
        }
        return this;
      };

      QueryBuilder.prototype.clear = function() {
        this.queryArgs = {};
        return this;
      };

      QueryBuilder.prototype.build = function() {
        var _this = this;
        return '"' + Object.keys(this.queryArgs).map(function(field) {
          return _this.queryArgs[field].build();
        }).join(' AND ') + '"';
      };

      return QueryBuilder;

    })();
  });

}).call(this);
