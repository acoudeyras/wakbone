'use strict'
define [], ->

  _checkers =
    notNull:
      message: 'should not be null'
      predicate: (obj) -> obj?
    isString:
      message: 'should be of type string'
      predicate: (obj) -> typeof obj is 'string'
    notEmpty:
      message: 'should not be empty'
      predicate: (obj) -> obj?.length > 0
    in:
      message: 'should in the list'
      predicate: (obj, [list]) -> obj in list

  _checkAll = (objects, message, predicate, args) ->
    objects.forEach (obj) ->
      throw new Error(message) if not predicate obj, args

  _check = (objects...) ->

    _buildCheckers = ->
      builded = {}
      Object.keys(_checkers).forEach (name) ->
        checker = _checkers[name]
        builded[name] = (args...) ->
          _checkAll objects, checker.message, checker.predicate, args
          @
      builded

    _buildCheckers()

