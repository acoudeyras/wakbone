define ['../../core/helpers', 'uritemplate', 'backgrid', 'moment.cell'], (helpers, uriTemplate) ->


  class WakCell extends Backgrid.Cell
    constructor: (args...) ->
      [@column, @model] = args
      super args...
    propName: ->
      if not @column?
        debugger
      @column.get 'name'
    attr: -> @model.attr @propName()
    rawVal: -> @model.get @propName()
    defUri: -> @rawVal()?.__deferred.uri
    render: ->
      @$el.empty()
      @_render?()
      @delegateEvents()
      @

  class UriTemplateCell extends WakCell
    constructor: (args...) -> 
      @uriTemplate = uriTemplate.parse @uriPattern
      @textTemplate = _.template @textTemplate
      super args...
    _render: ->
      modelAsJson = @model.toJSON()
      uri = @uriTemplate.expand modelAsJson
      text = @textTemplate modelAsJson
      @$el.append("""<a href="#{uri}">#{text}</a>""")

  class TemplateCell extends WakCell
    constructor: ->
      @htmlTemplate = _.template @template
      super()
    _render: ->
      modelAsJson = @model.toJSON()
      html = @htmlTemplate modelAsJson
      @$el.append(html)

  class ImageCell extends WakCell
    constructor: (args...) -> super args...
    _render: ->
      src = @rawVal()?.__deferred.uri
      return null if not src?
      @$el.append("""<a class="fancybox" rel="group" data-lightbox="img" href="#{src}" target="_blank"><img class="img-thumbnail" src="#{src}" alt="" /></a>""")
      
  Backgrid.Extension['UriTemplateCell'] = UriTemplateCell
  Backgrid.Extension['TemplateCell'] = TemplateCell
  Backgrid.Extension['ImageCell'] = ImageCell

  WakCell: WakCell
  ImageCell: ImageCell
  UriTemplateCell: UriTemplateCell
  TemplateCell: TemplateCell