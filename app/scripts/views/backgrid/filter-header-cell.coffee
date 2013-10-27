define ['backgrid'], ->

  _canSearch = (attr) ->
    return false if attr.type in ['image']
    true

  _keyCodesIgnored = [37, 38, 39, 40, 91]

  Header = Backgrid.HeaderCell.extend
    constructor: -> 
      Backgrid.HeaderCell.apply @, arguments
    _renderInput: ->
      
      _refresh = =>
        val = $input.val()
        @collection.query @column.get('name'), val
        @collection.fetch reset: true

      _applyExistingQuery = =>
        newVal = ''
        #if @collection.hasQuery fieldName
        #  clause = @collection.getQuery fieldName
        #  newVal = clause.val
        $input.val newVal
      
      $input = $('<input type="text" class="search-input" />')
      fieldName = @column.get('name')
      _applyExistingQuery()

      attr = @column.get('options').attr
      if not _canSearch(attr)
        $input.css 'visibility', 'hidden'
        return $input
      
      @collection.on('querychange', _applyExistingQuery)

      timeoutID = null
      $input.on('keyup', (e) =>
        return if e.keyCode in _keyCodesIgnored
        return if e.ctrlKey
        if timeoutID?
          clearTimeout timeoutID
        timeoutID = setTimeout _refresh, 200
      )
      $input
    render: ->
      Backgrid.HeaderCell.prototype.render.call @
      $container = $('<div />')
      @$el.append($container)
      @_renderInput().appendTo $container
      @