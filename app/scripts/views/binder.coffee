define ['epoxy'], ->

  _mergeBindings = (elements) ->
    bindings = {}
    for elem in elements
      bindings[elem.binding.name] = elem.binding.value
    bindings

  class Binder
    constructor: (@elements) ->
      @bindings = _mergeBindings @elements
    to: (model) ->
      @model = model
      @
    inside: (selector) ->
      BindingView = Backbone.Epoxy.View.extend(
        el: selector
        bindings: @bindings
      )
      new BindingView model: @model