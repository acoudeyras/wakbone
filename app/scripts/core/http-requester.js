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

      HttpRequester.prototype.upsert = function(model, options) {
        var data, ex, methodOptions, url;
        try {
          data = new ModelSerializer(model).toJSON();
        } catch (_error) {
          ex = _error;
          return helpers.rejectedPromise(ex.message);
        }
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

      HttpRequester.prototype.create = function(model, options) {
        return this.upsert(model, options);
      };

      HttpRequester.prototype.update = function(model, options) {
        return this.upsert(model, options);
      };

      HttpRequester.prototype["delete"] = function(model, options) {
        var methodOptions, url;
        url = model.url() + '/?$method=delete';
        methodOptions = {
          url: url,
          type: 'POST'
        };
        return $.ajax(_finalOptions(methodOptions, options));
      };

      return HttpRequester;

    })();
  });

}).call(this);
