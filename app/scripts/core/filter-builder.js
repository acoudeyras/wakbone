(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define([], function() {
    var FilterBuilder, FilterClause;
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
    return FilterBuilder = (function() {
      function FilterBuilder(dataClass) {
        this.dataClass = dataClass;
        this.filters = {};
      }

      FilterBuilder.prototype.isEmpty = function() {
        return Object.keys(this.filters).length === 0;
      };

      FilterBuilder.prototype.contains = function(name) {
        return this.filters[name] != null;
      };

      FilterBuilder.prototype.getClause = function(name) {
        return this.filters[name];
      };

      FilterBuilder.prototype.add = function(name, op, val) {
        var attr, clause;
        if (arguments.length = 2) {
          val = op;
          op = null;
        }
        attr = this.dataClass.attr(name);
        clause = new FilterClause({
          name: name,
          op: op,
          val: val,
          attr: attr
        });
        if (clause.isEmpty()) {
          delete this.queryArgs[clause.name];
        } else {
          this.filters[clause.name] = clause;
        }
        return this;
      };

      FilterBuilder.prototype.clear = function() {
        this.filters = {};
        return this;
      };

      FilterBuilder.prototype.build = function() {
        var _this = this;
        return '"' + Object.keys(this.filters).map(function(field) {
          return _this.filters[field].build();
        }).join(' AND ') + '"';
      };

      return FilterBuilder;

    })();
  });

}).call(this);
