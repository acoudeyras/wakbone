(function() {
  'use strict';
  define(['./helpers'], function(helpers) {
    var _asItCome, _types;
    _asItCome = function(value) {
      return value;
    };
    return _types = {
      string: {
        fromRaw: _asItCome,
        toRaw: _asItCome
      },
      number: {
        fromRaw: _asItCome,
        toRaw: _asItCome
      },
      long: {
        fromRaw: _asItCome,
        toRaw: _asItCome
      },
      date: {
        fromRaw: function(value) {
          return moment(value, moment.wakFormat);
        },
        toRaw: _asItCome
      },
      image: {
        fromRaw: _asItCome,
        toRaw: _asItCome
      }
    };
  });

}).call(this);
