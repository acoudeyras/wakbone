define ['marionette', 'epoxy'], ->  

  class ModelDetail extends Backbone.Epoxy.View
    constructor: (args...) ->
      super args...
    bindings:
      "input.first-name": "value:firstName,events:['keyup']"
