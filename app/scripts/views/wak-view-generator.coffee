define ['../core/helpers', './html-generator'], (helpers, HtmlGenerator)->

  _toClassName = (attr) -> _.dasherize(attr.name)

  class ViewResult
    constructor: (@html, @binding, @attr) ->
    @lazyval '$el', -> $(@html)

  class WakViewGenerator
    constructor: (@catalog) ->
      @html = new HtmlGenerator()
    _ensureAttr: (attr) -> 
      if typeof attr is 'string'
        attr = @catalog.$attr attr
      attr    
    input: (title, attr) ->
      attr = @_ensureAttr attr
      label = @html.label title
      className = _toClassName attr
      input = @html.textInput className
      new ViewResult(
        label + input,
          name: "input.#{className}"
          value: "value:#{attr.name},events:['keyup']",
        attr
      )
    text: (title, attr) ->
      attr = @_ensureAttr attr
      label = @html.label title
      className = _toClassName attr
      text = @html.text className
      new ViewResult(
        label + text,
          name: "span.#{className}"
          value: "text:#{attr.name}",
        attr
      )      
