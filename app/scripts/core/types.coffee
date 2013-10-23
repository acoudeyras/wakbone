define ['./helpers'], (helpers) ->
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
      fromRaw: (value) -> moment value, moment.wakFormat
      toRaw: _asItCome #TODO
    image:
      fromRaw: _asItCome #TODO
      toRaw: _asItCome #TODO