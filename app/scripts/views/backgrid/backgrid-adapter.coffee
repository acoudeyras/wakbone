define ['./column-creator', 'backgrid'], (ColumnCreator) ->

  class BackgridAdapter
    constructor: ({@collection, @columns, @catalog}) ->
    buildAllOptions: ->
    buildPagingFooter: ->
    buildCols: -> (new ColumnCreator(@catalog, column).toColumn() for column in @columns)
    buildGrid: ->
      columns = @buildCols()
      new Backgrid.Grid(
        collection: @collection
        columns: columns
        #footer: Footer
        className: 'table-hover backgrid'
      )
