define ['../../../../wakbone/scripts/views/backgrid/backgrid-adapter', '../../../../wakbone/scripts/views/backgrid/cells', 'marionette'], (BackgridAdapter, cells) ->

  _getRelatedCell = (attr) ->
    textTemplate: """<% if (#{attr.name}!= null) { %>
      <%= #{attr.name}.__KEY %>
    <% } %>"""
    uriPattern: '#models/' + attr.relatedDataClass.name + '/{__KEY}'

  _getRelatedsCell = (attr) ->
    textTemplate: 'See related'
    uriPattern: '#cols/' + attr.relatedDataClass.name + '/' + attr.path + '.ID/{__KEY}'

  _getIdCell = (attr) ->
    textTemplate: """<%= __KEY %>"""
    uriPattern: '#models/' + attr.dataClass.name + '/{__KEY}'

  _createUriTemplateCell = ({uriPattern, textTemplate}) ->
    cells.UriTemplateCell.extend(
      uriPattern: uriPattern
      textTemplate: textTemplate
    )

  _getCell = (attr) ->
    uriCellDef = null
    if attr.kind is 'relatedEntities'
      uriCellDef = _getRelatedsCell attr
    else if attr.kind is 'relatedEntity'
      uriCellDef = _getRelatedCell attr
    else if attr.identifying
      uriCellDef = _getIdCell attr
    return _createUriTemplateCell uriCellDef if uriCellDef?
    null

    #attrName = if attr.name is 'ID' then '__KEY' else attr.name


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