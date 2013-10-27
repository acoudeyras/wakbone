define ['../core/helpers', './html-generator'], (helpers, HtmlGenerator)->

  _toClassName = (attr) -> _.dasherize(attr.name)

  class ViewResult
    constructor: (@html, @binding, @attr) ->
      console.log binding
      console.log attr
      console.log '------'
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
    create: (html, binding) ->
      for selector, dataBinding of binding
        parts = dataBinding.split('.')
        attr = @_ensureAttr parts[0]
        dataBinding = parts[1]
        binding[selector] = dataBinding
      new ViewResult(
        html,
        binding
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
