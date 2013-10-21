'use strict'
define [], ->

  _directionsValues =
    ASC: ['ASC', 'asc', 1, true]
    DESC: ['DESC', 'desc', 0, -1, false]

  _parseDirection = (direction) ->
    return 'ASC' if not direction?
    if typeof direction is 'string'
      direction = direction.trim()
    return 'ASC' if direction in _directionsValues.ASC
    return 'DESC' if direction in _directionsValues.DESC
    'ASC'
  _parseOne = (field, direction) ->
    parsedDirection = _parseDirection direction
    field: field.trim()
    direction: parsedDirection
  _parseOneFromString = (orderBy) ->
    [field, direction] = orderBy.trim().split(' ')
    _parseOne field, direction
  _parseArray = (orderBys) ->
    result = {}
    for orderBy in orderBys
      parsed = _parseOneFromString orderBy
      result[parsed.field] = parsed.direction
    result
  _parseObject = (orderBys) ->
    result = {}
    for field, direction of orderBys
      parsed = _parseOne field, direction
      result[parsed.field] = parsed.direction
    result
  parse = (orderBys) ->
    return _parseArray orderBys if orderBys.length > 1
    orderBy = orderBys[0]
    if typeof orderBy is 'string'
      return _parseArray orderBy.split(',')
    return _parseObject orderBy  