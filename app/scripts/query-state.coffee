'use strict'
define ['./rest-query', './orderby-parser'], (RestQuery, _parseOrderBy) ->

  class QueryState
    constructor:(@collection, @rootUrl, @originState)->
      @state = _.extend QueryState.default, originState
      @_query = new RestQuery @rootUrl
    filter:(fieldName, val, op) ->
    orderBy: (orderBys...) ->
      parsedOrderBys = _parseOrderBy orderBys
      @_query.orderBy parsedOrderBys
      @_orderBy = parsedOrderBys
      @
    select: () ->
    skip: (skip) ->
      @state.skip = skip
      @_query.skip skip
      @
    limit: (limit) ->
      @state.limit = limit
      @_query.limit limit
      @
    expand: (expand) ->
    clear: ->
      @state = _.extend QueryState.default, @originState
      @_query = new RestQuery @rootUrl
    url: -> @_query.url
    @default:
      skip: 0
      limit: 100