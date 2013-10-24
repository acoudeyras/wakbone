define ['./wak-view-generator', './binder'], (WakViewGenerator, Binder) ->


  class WakViews
    constructor: (@catalog) ->
      @create = new WakViewGenerator @catalog
    bind: (elements...) -> new Binder elements