define ['../../../../wakbone/scripts/views/backgrid/backgrid-adapter', '../../../../wakbone/scripts/views/backgrid/cells', 'marionette'], (BackgridAdapter, cells) ->

  _getCell = (attr) ->
    return null if attr.kind not in ['relatedEntities', 'relatedEntity']
    attrName = if attr.name is 'ID' then '__KEY' else attr.name
    
    if attr.kind is 'relatedEntities'
      reverseDataClass = attr.catalog.$entryFromCollectionName(attr.type)
      attrName = 'See related'
      uriPattern = '#cols/' + reverseDataClass.name + '/' + attr.path + '/{__KEY}'
    else
      attrName = '<%= __KEY %>'
      uriPattern = '/{__KEY}'

    cells.UriTemplateCell.extend(
      uriPattern: uriPattern
      textTemplate: attrName
    )


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
          editable: false
          cell: _getCell attr
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