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

    upsert: (data, model, options) ->
      console.log data
      return helpers.resolvedPromise() if not data?
      url = model.url() + '/?$method=update'
      methodOptions = url: url, data: data, type: 'POST'
      $.ajax _finalOptions(methodOptions, options)      

    create: (model, options) ->
      data = new ModelSerializer(model).allToJSON()
      @upsert data, model, options

    update: (model, options) ->
      data = new ModelSerializer(model).allToJSON()
      @upsert data, model, options

    delete: (model, options) ->
      throw new Error('method not supported yet')