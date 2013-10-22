'use strict'
define [], ->

  class FilterClause
    constructor: ({@name, @val, @op, @attr}) ->
    _buildField: ->
      if @attr.kind in ['relatedEntity']
        @name + '.ID'
      else
        @name
    _tryFindOpInVal: (nbchar) ->
      if @val.substring(0, nbchar) in FilterClause.operators
        op: @val.substring 0, nbchar
        nbchar: nbchar
      else
        null
    operatorInVal: ->
      found = @_tryFindOpInVal 2
      return found if found?
      found = @_tryFindOpInVal 1
      return null if not found?
      return found if found.op isnt '!'
      op: '!='
      nbchar: 1
    _buildValue: ->
      val = @val
      opInVal = @operatorInVal()
      if opInVal?
        val = val.substring(opInVal.nbchar, val.length)
      if @attr.type is 'string'
        "'" + val + "'"
      else
        val
    _buildOp: ->
      #the caller has explicitly specified an operator
      return @op if @op?
      #operator is in value, in filter fields you should
      #be able to write >10 for example
      opInVal = @operatorInVal()
      return opInVal.op if opInVal?
      return '=' if @attr.identifying
      return ' begin ' if @attr.type is 'string'
      '='
    isEmpty: -> @val == null or @val.trim() is ''
    build: -> @_buildField() + @_buildOp() + @_buildValue()
    @operators: ['<', '>', '=', '!', '!=', '>=', '<=']

  class FilterBuilder
    constructor: (@dataClass) ->
      @filters = {}
    isEmpty: -> Object.keys(@filters).length is 0
    contains: (name) -> @filters[name]?
    getClause: (name) -> @filters[name]
    add : (name, op, val) ->
      if arguments.length = 2
        val = op
        op = null
      attr = @dataClass.attr name
      clause = new FilterClause(
        name: name
        op: op
        val: val
        attr: attr
      )
      if clause.isEmpty()
        delete @queryArgs[clause.name]
      else
        @filters[clause.name] = clause
      @
    clear: ->
      @filters = {}
      @
    build: ->
      '"' + Object.keys(@filters).map( (field) =>
        @filters[field].build()
      ).join(' AND ') + '"'
