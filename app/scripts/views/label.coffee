define ['stickit'], ->

  class LabelView extends Backbone.View
    initialize: (options) ->
      @bindings = options.bindings
      super arguments
    render: ->
      console.log @bindings
      console.log @model
      @$el.html('<div/> <input class="title" type="text"><span class="title">');

      #$el.append $('<span class="title"></span>')
      @stickit()
      @
