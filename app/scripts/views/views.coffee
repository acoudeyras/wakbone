define ['./label'], (LabelView) ->

  newLabel: (el, model, property) ->
    new LabelView(
      model: model
      el: el
      bindings:
        '.title': property
    ).render()

  within: (container) ->
    $container = $(container)
    _render = (model, property) ->
      _createWidget = (widget) ->
        $el = $('<div>')
        $container.append $el
        new LabelView(
          model: model
          el: $el
          bindings:
            '.title': property
        ).render()
        render: _render

      withA: _createWidget
      withAn: _createWidget
    render: _render

