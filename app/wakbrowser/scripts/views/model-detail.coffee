define ['marionette', 'epoxy'], ->

  _isValid = (attr) ->
    true

  _createHtmlText = (attr) ->
    binding = _cleanName attr.name
    """<span data-bind="text:#{binding}" class="form-control"></span>"""

#.relatedDataClass.name + '

  _createHtmlLink = (attr) ->
    if attr.kind is 'relatedEntity'
      binding = attr.name + '.__KEY'
    else
      binding = attr.name + '.__KEY'

    """<a data-bind="text:#{binding},href:#{binding}" class="form-control"></a>"""

  _creatHtmlValue = (attr) ->
    if attr.kind in ['relatedEntity', 'relatedEntities']
      _createHtmlLink attr
    else
      _createHtmlText attr

  _createHtmlField = (attr)->
    title = attr.name
    """<div class="form-group">
      <label class="control-label col-sm-2">#{title}</label>
      <div class="col-sm-10">
        #{_creatHtmlValue attr}
      </div>
    </div>"""

  _cleanName = (name) ->
    return '__KEY' if name is 'ID'
    name
  
  _createHtml = (dataClass) ->
    html = """<form class="form-horizontal" role="form">"""
    for attr in dataClass.attr() when _isValid attr
      html += _createHtmlField attr
    html += '</form>'

  _createBindings = (dataClass) ->
    bindings = {}
    for attr in dataClass.attr() when _isValid attr
      name = _cleanName attr.name
      bindingAsCssClass = _.dasherize name
      bindings['.' + bindingAsCssClass] = 'text:' + name
    bindings

  _createEpoxyView = (model, el) ->
    html = _createHtml(model.dataClass)
    $(el).html html
    Backbone.Epoxy.View.extend(
      el: el
      bindings: 'data-bind'
    )


  class ModelDetail extends Backbone.View
    render: ->
      EpoxyView = _createEpoxyView @model, @el
      @epoxyView = new EpoxyView(model: @model)
      @



