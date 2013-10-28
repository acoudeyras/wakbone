define ['../../core/helpers', 'uritemplate', 'backgrid'], (helpers, uriTemplate) ->
  
  
  class UriTemplateCell extends BackGridCell
    initialize: ({pattern, @text}) ->
      @template = uriTemplate.parse pattern
    _render: ->
      uri = @template.expand @model.toJSON()
      @$el.append("""<a href="#{uri}">#{@text}</a>""")


  cells =
    identity:
      className: "uri-cell"
      _render: ->
        val = @rawVal()
        url = '#entities/' + @model.$def.collectionName + '/' + val
        @$el.append($('<a>',
          tabIndex: -1
          href: url
          title: 'Show entity'
        ).text(val))

    relatedEntity:
      className: "uri-cell"
      _render: -> @$el.append @renderer().relatedEntity()

    relatedEntities:
      className: "uri-cell"
      _render: ->
        @$el.append @renderer().relatedEntities()

    image:
      className: "img-cell"
      _render: -> @$el.append @renderer().image()

  WakCell = Backgrid.Cell.extend(
    constructor: (options) ->
      @_renderer = renderer options.model.$catalog
      Backgrid.Cell.prototype.constructor.apply @, arguments
    renderer: -> @_renderer.with @model, @rawVal(), @attr()
    propName: -> @column.get 'name'
    attr: -> @model.attr @propName()
    rawVal: -> @model.get @propName()
    defUri: -> @rawVal()?.__deferred.uri
    render: ->
      @$el.empty()
      @_render?()
      @delegateEvents()
      @     
  )

  build = ->
    _buildCell = (name, options) ->
      cleanName = _.capitalize(name) + 'Cell'
      Backgrid[cleanName] = WakCell.extend(options)
    Object.keys(cells).forEach (name) ->
      cells[name] = _buildCell name, cells[name]
    cells

  build(cells)