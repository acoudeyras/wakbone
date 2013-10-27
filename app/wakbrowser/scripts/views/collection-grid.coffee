define ['../../../../wakbone/scripts/views/backgrid/backgrid-adapter', 'marionette'], (BackgridAdapter) ->

  CollectionGrid = Backbone.View.extend(
    initialize: (options) ->
      Backbone.View::initialize.apply @, arguments
    setDataClass: (@dataClass) ->
      @render()
    _buildColumns: ->
      columns = []
      for attr in @dataClass.attr()
        columns.push
          attr: attr
          title: attr.name
      columns
    render: ->
      @$el.empty()
      return if not @dataClass
      columns = @_buildColumns()

      @backgridAdapter = new BackgridAdapter(
        collection: @dataClass.entities
        columns: columns
        catalog: @dataClass.catalog
      )
      grid = @backgridAdapter.buildGrid()
      @$el.append grid.render().$el
      ###
      paginator = new Backgrid.Extension.Paginator(
        collection: @collection
      )
      @$el.append paginator.render().$el
      ###
      @
  )