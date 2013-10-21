'use strict'
define [], ->

  _isObject = (object) -> typeof object is 'object'

  _isModel = (object) -> _isObject(object) and object instanceof Backbone.Model

  _isCollection = (object) -> _isObject(object) and object instanceof Backbone.Collection

  _findSeparators = (expression) ->
    dotPos = expression.indexOf '.'
    bracketPos = expression.indexOf '['
    dotPos = if dotPos is - 1 then Infinity else dotPos
    bracketPos = if bracketPos is - 1 then Infinity else bracketPos

    dot: dotPos
    bracket: bracketPos
    noneMatch: dotPos is Infinity and bracketPos is Infinity

  _read = (str, separator) ->
    parts = str.split separator
    val = parts[0]
    parts.splice 0, 1
    remaining = parts.join separator

    val: val
    remaining: remaining

  _walkToDot = (model, expression) ->
    {val, remaining} = _read expression, '.'
    subProp = model.get val
    if not _isModel subProp or not _isCollection subProp #only models ?
      throw new Error('Property ' + val + ' is not a model or a collection or is not fetched')
    return subProp.walk remaining

  _walkToBracket = (model, expression) ->
    {val, remaining} = _read expression, '['
    subProp = model.get val
    if not _isCollection subProp
      throw new Error('Property ' + val + ' is not a collection or is not fetched')

    {val, remaining} = _read remaining, ']'
    if _.isBlank remaining
      throw new Error('Invalid walk expression ' + expression + ' : missing ]')
    if _.startsWith remaining, '.' #should remove . of [0].
      remaining = _.splice remaining, 0, 1

    subModel = subProp.at +val
    return subModel.walk remaining

  class BackboneWalker
    constructor: (@model) ->
    walk: (expression) ->
      sep = _findSeparators expression
      if sep.noneMatch
        return model: @model, property: expression
      #debugger
      if sep.dot < sep.bracket
        _walkToDot @model, expression
      else
        _walkToBracket @model, expression
