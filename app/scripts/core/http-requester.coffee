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

    upsert: (model, options) ->
      try
        data = new ModelSerializer(model).toJSON()
      catch ex
        return helpers.rejectedPromise ex.message
      return helpers.resolvedPromise() if not data?
      url = model.url() + '/?$method=update'
      methodOptions = url: url, data: data, type: 'POST'
      $.ajax _finalOptions(methodOptions, options)

    create: (model, options) -> @upsert model, options

    update: (model, options) -> @upsert model, options

    delete: (model, options) ->
      url = model.url() + '/?$method=delete'
      methodOptions = url: url, type: 'POST'
      $.ajax _finalOptions(methodOptions, options)