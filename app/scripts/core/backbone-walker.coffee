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

  
  #Read the first item of an `expression` for a given `separator` and return it with the remaining text
  #
  #`_read('manager.company.name', '.') -> 'manager', 'company.name'`
  #`_read('managedCompanies[0].name', '.') -> 'managedCompanies', '0].name'`
  _read = (expression, separator) ->
    parts = expression.split separator
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
    subProp.walk(remaining)

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
    subModel.walk(remaining)

  #BackboneWalker
  #===============
  class BackboneWalker
    constructor: (@model) ->
    walk: (expression) ->
      seps = _findSeparators expression
      found = null
      if seps.noneMatch
        found = model: @model, property: expression
      else if seps.dot < seps.bracket
        found = _walkToDot @model, expression
      else
        found = _walkToBracket @model, expression

      found.val = -> Backbone.Model::get.call found.model, found.property
      found

