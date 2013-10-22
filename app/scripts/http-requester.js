(function() {
  'use strict';
  define(['./model-serializer', './helpers', 'backbone'], function(ModelSerializer, helpers) {
    var HttpRequester, _defaultAjaxOptions, _finalOptions;
    _defaultAjaxOptions = {
      dataType: 'json',
      contentType: 'application/json'
    };
    _finalOptions = function(httpRequesterOptions, callerOptions) {
      return $.extend({}, httpRequesterOptions, callerOptions, _defaultAjaxOptions);
    };
    return HttpRequester = (function() {
      function HttpRequester() {}

      HttpRequester.prototype.read = function(model, options) {
        return Backbone.Model.prototype.sync.apply(model, ['read', model, options]);
      };

      HttpRequester.prototype.create = function() {
        throw new Error('method not supported yet');
      };

      HttpRequester.prototype.update = function(model, options) {
        var data, methodOptions, url;
        data = new ModelSerializer(model).toJSON();
        if (data == null) {
          return helpers.resolvedPromise();
        }
        url = model.url() + '/?$method=update';
        methodOptions = {
          url: url,
          data: data,
          type: 'POST'
        };
        return $.ajax(_finalOptions(methodOptions, options));
      };

      HttpRequester.prototype["delete"] = function() {
        throw new Error('method not supported yet');
      };

      return HttpRequester;

    })();
  });

}).call(this);
