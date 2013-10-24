define ['underscore'], ->

  _buildClasses = (type, callerClasses) -> 
    typeClasses = HtmlGenerator.defaultOptions[type].classNames || []
    callerClasses ?= []
    classes = typeClasses.concat callerClasses
    return '' if classes.length is 0
    ' class="' + classes.join(' ') + '"'

  _methodBuilder = (method, name) ->
    (args...) ->
      lastArg = args[method.length - 1]
      classes = _buildClasses name, lastArg
      if method.length is args.length
        args.pop()
      args.push classes
      method.apply @, args

  #To avoid each method doing the merge between the provided classes and the default classes
  #They are all wrapped within a function that given them the html class attribute
  _addClassesHandler = ->
    for name, method of HtmlGenerator::
      if typeof method is 'function'
        HtmlGenerator::[name] = _methodBuilder(method, name)
    undefined

  class HtmlGenerator
    constructor: (options) ->
      options ?= {}
      @options = _.extend options, HtmlGenerator.defaultOptions

    label: (title, css) ->
      charAfterTitle = @options.label.charAfterTitle
      """<label#{css}>#{title}#{charAfterTitle}</label>"""

    text: (css) -> """<span#{css}></span>"""

    textInput: (css)-> """<input type="text"#{css}>"""
    @defaultOptions:
      text: {}
      label:
        charAfterTitle: ':'
      textInput: {}


  _addClassesHandler()
  HtmlGenerator
