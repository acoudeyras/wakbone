define ['../../core/helpers', './cells', './filter-header-cell'], (helpers, cells, FilterHeaderCell)->

  class ColumnCreator
    constructor: (@catalog, {@attr, @title, @cell}) ->
    @property 'rawType',
      get: ->
        found = ColumnCreator.rawTypes[@attr.type]
        if not found
          console.log "storage type #{@attr.type} not supported" 
          return 'string'
        found
    @property 'formatter',
      get: -> formatters[@attr.kind]
    @property 'type',
      get: ->
        return @rawType if @attr.isRaw
        return 'uri' if @attr.kind in ['relatedEntities', 'relatedEntity']
        throw "kind #{kind} not supported"
    getCell: ->
        return @cell if @cell?
        kind = if @attr.identifying then 'identity' else @attr.kind
        custom = cells[kind]
        return kind if custom?
        @type
    toColumn: ->
      #formatter: @formatter      
      name: @attr.name
      label: @attr.name
      editable: !@attr.readOnly
      cell: @getCell()
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
