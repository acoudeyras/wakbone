'use strict'
define [], ->
  _asItCome = (value) -> value
  _types =
    string:
      fromRaw: _asItCome
      toRaw: _asItCome
    number:
      fromRaw: _asItCome
      toRaw: _asItCome
    long:
      fromRaw: _asItCome
      toRaw: _asItCome
    date:
      fromRaw: _asItCome #TODO
      toRaw: _asItCome #TODO
    image:
      fromRaw: _asItCome #TODO
      toRaw: _asItCome #TODO