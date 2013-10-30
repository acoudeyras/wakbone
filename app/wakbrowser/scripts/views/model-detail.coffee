define ['marionette', 'epoxy'], ->

  _isValid = (attr) ->
    true

  _createHtmlText = (attr, bindingClass, bindingName) ->
    html: """<span data-bind="text:bindingName" form-control"></span>"""
    bindings:
      'span.' + bindingClass: 'text:' + bindingName

  _createHtmlLink = (attr, bindingClass, bindingName) ->
    html: """<a class="#{bindingClass} form-control"></a>"""
    bindings:
      'a.' + bindingClass: 'text:' + bindingName

  _creatHtmlValue = (attr) ->
    binding = _cleanName attr.name
    bindingAsCssClass = _.dasherize binding
    if attr.kind in ['relatedEntity', 'relatedEntities']
      _createHtmlLink attr, bindingAsCssClass, binding
    else
      _createHtmlText attr, bindingAsCssClass, binding

  _createHtmlField = (attr)->
    title = attr.name
    val = _creatHtmlValue attr
    html: """<div class="form-group">
      <label class="control-label col-sm-2">#{title}</label>
      <div class="col-sm-10">
        #{val.html}
      </div>
    </div>"""
    bindings: val.bindings

  _cleanName = (name) ->
    return '__KEY' if name is 'ID'
    name
  
  _createHtml = (dataClass) ->
    html = """<form class="form-horizontal" role="form">"""
    bindings = {}
    for attr in dataClass.attr() when _isValid attr
      fld = _createHtmlField attr
      html += fld.html
      for key, val of fld.bindings
        bindings[key] = val
    html += '</form>'

    html: html
    bindings: bindings


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
      bindings: _createBindings model.dataClass
    )


  class ModelDetail extends Backbone.View
    render: ->
      EpoxyView = _createEpoxyView @model, @el
      @epoxyView = new EpoxyView(model: @model)
      @



