define ['../../../../wakbone/scripts/views/backgrid/backgrid-adapter', 'marionette'], (BackgridAdapter) ->

  CollectionGrid = Backbone.View.extend(
    setCol: (@collection) ->
      @render()
    render: ->
      @$el.empty()
      return if not @collection
      grid = backgridFactory.create @collection
      @$el.append grid.render().$el
      paginator = new Backgrid.Extension.Paginator(
        collection: @collection
      )
      @$el.append paginator.render().$el
      @
  )