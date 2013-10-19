define ['./wak-model', 'backbone'], (wakModelFactory) ->

  class Catalog
    constructor: (data) ->
      @_dataClasses = data.dataClasses
      models = @_dataClasses.map (dataClass) =>
        wakModelFactory.create dataClass, @

      @models = _.indexBy models, 'className'

    @load: (success) ->
      $.ajax('/rest/$catalog/$all')
        .then (data) -> new Catalog data