define ['marionette', 'epoxy'], ->

  _createHtmlText = (attr) ->
    binding = _cleanName attr.name
    """<span data-bind="text:#{binding}" class="form-control"></span>"""

  _createHtmlLink = (attr) ->
    """<a data-bind="text:#{attr.name + '__KEY'},attr:{href:#{attr.name + '__URL'}}" class="form-control"></a>"""

  _creatHtmlValue = (attr) ->
    if attr.kind in ['relatedEntity', 'relatedEntities']
      a = _createHtmlLink attr
      console.log a
      a
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
    for attr in dataClass.attr()
      html += _createHtmlField attr
    html += '</form>'

  #Dirty hack because Epoxy doesn't handle deep model, i have to create a view model
  #That add all deep properties at the root
  _createViewModel = (model) ->
    relatedValues = {}

    for attr in model.dataClass.attr() when attr.kind is 'relatedEntity'
      val = model.get attr.name
      url = null
      if val?
        val = val.id
        url = '#models/' + attr.relatedDataClass.name + '/' + val
      relatedValues[attr.name + '__KEY'] = val
      relatedValues[attr.name + '__URL'] = url

    for attr in model.dataClass.attr() when attr.kind is 'relatedEntities'
      relatedValues[attr.name + '__KEY'] = 'See relateds'
      url = '#cols/' + attr.relatedDataClass.name + '/' + attr.path + '.ID/' + model.id
      relatedValues[attr.name + '__URL'] = url

    new Backbone.Model(relatedValues)

  _createEpoxyView = (model, el) ->
    html = _createHtml(model.dataClass)
    $(el).html html

    Backbone.Epoxy.View.extend(
      el: el
      bindings: 'data-bind'
      viewModel: _createViewModel model
    )


  class ModelDetail extends Backbone.View
    render: ->
      EpoxyView = _createEpoxyView @model, @el
      @epoxyView = new EpoxyView(model: @model)
      @



