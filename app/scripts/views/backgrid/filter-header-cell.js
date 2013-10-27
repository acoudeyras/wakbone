(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['backgrid'], function() {
    var Header, _canSearch, _keyCodesIgnored;
    _canSearch = function(attr) {
      var _ref;
      if ((_ref = attr.type) === 'image') {
        return false;
      }
      return true;
    };
    _keyCodesIgnored = [37, 38, 39, 40, 91];
    return Header = Backgrid.HeaderCell.extend({
      constructor: function() {
        return Backgrid.HeaderCell.apply(this, arguments);
      },
      _renderInput: function() {
        var $input, attr, fieldName, timeoutID, _applyExistingQuery, _refresh,
          _this = this;
        _refresh = function() {
          var val;
          val = $input.val();
          _this.collection.query(_this.column.get('name'), val);
          return _this.collection.fetch({
            reset: true
          });
        };
        _applyExistingQuery = function() {
          var newVal;
          newVal = '';
          return $input.val(newVal);
        };
        $input = $('<input type="text" class="search-input" />');
        fieldName = this.column.get('name');
        _applyExistingQuery();
        attr = this.column.get('options').attr;
        if (!_canSearch(attr)) {
          $input.css('visibility', 'hidden');
          return $input;
        }
        this.collection.on('querychange', _applyExistingQuery);
        timeoutID = null;
        $input.on('keyup', function(e) {
          var _ref;
          if (_ref = e.keyCode, __indexOf.call(_keyCodesIgnored, _ref) >= 0) {
            return;
          }
          if (e.ctrlKey) {
            return;
          }
          if (timeoutID != null) {
            clearTimeout(timeoutID);
          }
          return timeoutID = setTimeout(_refresh, 200);
        });
        return $input;
      },
      render: function() {
        var $container;
        Backgrid.HeaderCell.prototype.render.call(this);
        $container = $('<div />');
        this.$el.append($container);
        this._renderInput().appendTo($container);
        return this;
      }
    });
  });

}).call(this);
