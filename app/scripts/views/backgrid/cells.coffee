define ['../../core/helpers', 'uritemplate', 'backgrid'], (helpers, uriTemplate) ->
  
  class WakCell extends Backgrid.Cell
    initialize: ({@column, @model}) ->
    propName: -> @column.get 'name'
    attr: -> @model.attr @propName()
    rawVal: -> @model.get @propName()
    defUri: -> @rawVal()?.__deferred.uri
    render: ->
      @$el.empty()
      @_render?()
      @delegateEvents()
      @

  class UriTemplateCell extends WakCell
    initialize: ->
      @uriTemplate = uriTemplate.parse @uriPattern
      @textTemplate = _.template @textTemplate
      WakCell::initialize.apply @, arguments
    _render: ->
      modelAsJson = @model.toJSON()
      uri = @uriTemplate.expand modelAsJson
      text = @textTemplate modelAsJson
      @$el.append("""<a href="#{uri}">#{text}</a>""")

  class TemplateCell extends WakCell
    initialize: ->
      @htmlTemplate = _.template @template
    _render: ->
      modelAsJson = @model.toJSON()
      html = @htmlTemplate modelAsJson
      @$el.append(html)

  class ImageCell extends WakCell
    initialize: ->
    _render: ->
      src = @rawVal()?.__deferred.uri
      return null if not src?
      @$el.append("""<a class="fancybox" rel="group" data-lightbox="img" href="#{src}" target="_blank"><img class="img-thumbnail" src="#{src}" alt="" /></a>""")
      
  Backgrid['UriTemplateCell'] = UriTemplateCell
  Backgrid['TemplateCell'] = TemplateCell
  Backgrid['ImageCell'] = ImageCell

  WakCell: WakCell
  ImageCell: ImageCell
  UriTemplateCell: UriTemplateCell
  TemplateCell: TemplateCell