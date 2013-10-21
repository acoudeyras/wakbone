'use strict'

define ['./helpers', './check'], (helpers, check)->

  _protect = (str) -> '"' + str + '"'

  class UrlBuilder
    constructor: (@root) ->
      @_queryParams = {}
      @_pathParams = []
    query: (name, value) ->
      @_queryParams[name] = value
    path: (name) ->
      @_pathParams.push name
    clearQuery: -> @_queryParams = {}
    clearPath: -> @_pathParams = []
    buildPathParams: ->
      return '' if not @_pathParams.length
      '/' + @_pathParams.join('/')
    buildQueryParams: ->
      params = Object.keys @_queryParams
      return '' if not params.length
      params = params.map (name) => name + '=' + @_queryParams[name]
      '?' + params.join('&')
    build: ->
      @root + @buildPathParams() + @buildQueryParams()

  _computedKeywords = ['$all', 'count', 'average', 'min', 'max', 'sum']
  class RestQuery
    constructor: (@root) ->
      check(@root).notNull().isString().notEmpty()
      @urlBuilder = new UrlBuilder(@root)
    key: (key) ->
      @urlBuilder = new UrlBuilder(@root + '(' + key + ')')
      @
    select: (properties...) ->
      @urlBuilder.path properties.join(',')
      @
    _numParam: (num, queryParamName) ->
      castedNum = parseInt(num, 10) #parseInt instead of + to handle +null = 0
      if castedNum isnt castedNum
        helpers.log 'bad ' + queryParamName + ' parameter: ' + num
        return @
      @urlBuilder.query '$' + queryParamName, castedNum
      @
    clearSelect: ->
      @urlBuilder.clearPath()
      @
    limit: (num) -> @_numParam num, 'limit'
    skip: (num) -> @_numParam num, 'skip'
    timeout: (num) -> @_numParam num, 'timeout'
    expand: (expanded...) ->
      expanded = expanded.join(',')
      @urlBuilder.query '$expand', expanded
      @
    where: (clause) ->
      @urlBuilder.query '$filter', _protect clause
      @
    orderBy: (clause) ->
      orderBys = (field + ' ' + direction for field, direction of clause)
      @urlBuilder.query '$orderby', orderBys.join(',')
      @
    distinct: (property)->
      @urlBuilder.clearPath()
      @select property
      @urlBuilder.query '$distinct', 'true'
      @
    compute: (property, keyword = '$all') ->
      check(keyword).in _computedKeywords #remove orderby ?
      @urlBuilder.clearPath()
      @select property
      @urlBuilder.query '$compute', keyword
      @
    @getter 'url', -> @urlBuilder.build()
