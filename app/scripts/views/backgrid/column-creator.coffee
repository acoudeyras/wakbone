define ['../../core/helpers', './cells', './filter-header-cell'], (helpers, cells, FilterHeaderCell)->

  class ColumnCreator
    constructor: (@catalog, {@attr, @title, @cell, @editable}) ->
    typeAlias: ->
      found = ColumnCreator.typesAlias[@attr.type]
      if not found?
        console.log "storage type #{@attr.type} not supported"
        return ColumnCreator.typesAlias.string
      found
    @property 'type',
      get: ->
        return @typeAlias if @attr.isRaw
        #return 'uri' if @attr.kind in ['relatedEntities', 'relatedEntity']
        throw "kind #{kind} not supported"
    getCell: ->
        return @cell if @cell?
        alias = @typeAlias()
        return alias if typeof alias is 'string'
        alias.cell
        #kind = if @attr.identifying then 'identity' else @attr.kind
        #custom = cells[@attr.kind]
        #return kind if custom?
    getFormatter: ->
      alias = @typeAlias()
      return null if typeof alias is 'string'
      alias.formatter
    toColumn: ->
      column =
        name: @attr.name
        label: @attr.name
        editable: if @editable? then @editable else !@attr.readOnly
        cell: @getCell()
        headerCell: FilterHeaderCell
        options:
          attr: @attr
      formatter = @getFormatter()
      if formatter?
        column.formatter = formatter
      column
    @typesAlias = 
      string: 'string'
      long: 'integer'
      number: 'number',
      date:
        cell: Backgrid.Extension.MomentCell.extend
          modelFormat: "YYYY/M/D"
          displayLang: "zh-tw"
          displayFormat: "YYYY-MMM-DD"
        formatter: new Backgrid.Extension.MomentFormatter()
      image: 'image'
      bool: 'boolean'
