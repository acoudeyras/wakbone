define ['underscore.string'], (_str) ->

  _.mixin _.str.exports()

  _extensions =
    lowerCamelize: (str) ->
      str = _.camelize str
      str[0].toLowerCase() + str.substring(1, str.length)

  _.mixin _extensions
  null