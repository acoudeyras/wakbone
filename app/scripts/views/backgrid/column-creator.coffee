define ['../../core/helpers', './cells', './filter-header-cell'], (helpers, cells, FilterHeaderCell)->

  class ColumnCreator
    constructor: (@catalog, {@attr, @title}) ->
    @property 'rawType',
      get: ->
        found = ColumnCreator.rawTypes[@attr.type]
        if not found
          console.log "storage type #{@attr.type} not supported" 
          return 'string'
        found
    @property 'formatter',
      get: -> formatters[@attr.kind]
    @property 'cell',
      get: ->
        kind = if @attr.identifying then 'identity' else @attr.kind
        custom = cells[kind]
        return kind if custom?
        @type
    @property 'type',
      get: ->
        return @rawType if @attr.isRaw
        return 'uri' if @attr.kind in ['relatedEntities', 'relatedEntity']
        throw "kind #{kind} not supported"
    toColumn: ->
      name: @attr.name
      label: @attr.name
      editable: !@attr.readOnly
      cell: @cell
      #formatter: @formatter
      headerCell: FilterHeaderCell
      options:
        attr: @attr
      
    @rawTypes = 
      string: 'string'
      long: 'integer'
      number: 'number',
      date: 'date',
      image: 'image'
      bool: 'boolean'
