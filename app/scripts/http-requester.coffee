'use strict'
define ['./model-serializer', './helpers', 'backbone'], (ModelSerializer, helpers) ->

  _defaultAjaxOptions =
    dataType: 'json'
    contentType: 'application/json'

  _finalOptions = (httpRequesterOptions, callerOptions) ->
    $.extend {}, httpRequesterOptions, callerOptions, _defaultAjaxOptions

  class HttpRequester
    constructor: ->

    read: (model, options) ->
      Backbone.Model::sync.apply model, ['read', model, options]

    create: ->
      throw new Error('method not supported yet')

    update: (model, options) ->
      data = new ModelSerializer(model).toJSON()
      return helpers.resolvedPromise() if not data?

      url = model.url() + '/?$method=update'
      methodOptions = url: url, data: data, type: 'POST'
      $.ajax _finalOptions(methodOptions, options)

    delete: ->
      throw new Error('method not supported yet')