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

  class QueryBuilder
    constructor: (@def) ->
      @queryArgs = {}
    isEmpty: -> Object.keys(@queryArgs).length is 0
    contains: (name) -> @queryArgs[name]?
    getClause: (name) -> @queryArgs[name]
    attr: (name) ->
      _.find @def.attributes, (attr) ->
        attr.name is name
    add : (fieldName, val, op) ->
      if @attr(fieldName) == null
        debugger
      clause = new FilterClause(
        name: fieldName
        op: op
        val: val
        attr: @attr(fieldName)
      )
      if clause.isEmpty()
        delete @queryArgs[clause.name]
      else
        @queryArgs[clause.name] = clause
      @
    clear: ->
      @queryArgs = {}
      @
    build: ->
      '"' + Object.keys(@queryArgs).map( (field) =>
        @queryArgs[field].build()
      ).join(' AND ') + '"'
