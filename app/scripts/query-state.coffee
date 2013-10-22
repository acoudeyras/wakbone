'use strict'
define ['./wak-url-builder', './orderby-parser'], (UrlBuilder, _parseOrderBy) ->

  class QueryState
    constructor:(@collection, @rootUrl, @originState)->
      @state = _.extend QueryState.default, originState
      @_urlBuilder = new UrlBuilder @rootUrl
    filter:(fieldName, val, op) ->
    orderBy: (orderBys...) ->
      parsedOrderBys = _parseOrderBy orderBys
      @_urlBuilder.orderBy parsedOrderBys
      @_orderBy = parsedOrderBys
      @
    select: () ->
    skip: (skip) ->
      @state.skip = skip
      @_urlBuilder.skip skip
      @
    limit: (limit) ->
      @state.limit = limit
      @_urlBuilder.limit limit
      @
    expand: (expands...) ->
      @state.expands = expands
      @_urlBuilder.expand expands
      @
    clear: ->
      @state = _.extend QueryState.default, @originState
      @_urlBuilder = new UrlBuilder @rootUrl
    url: -> @_urlBuilder.url
    @default:
      skip: 0
      limit: 100