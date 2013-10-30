define ['marionette'], ->

  BrowseDropDownView = Backbone.View.extend
    initialize: ({@catalog}) ->
      Backbone.View::initialize.apply @, arguments
    _renderItem: (dataClass) ->
      name = dataClass.name
      $("""<li role="presentation"><a role="menuitem" tabindex="-1" href="http://www.google.fr">#{name}</a></li>""")
    highlight: ->
      @$el.parent().addClass 'animated shake'
    render: ->
      @$el.empty()
      _.each @catalog.$classNames, (className) =>
        @_renderItem(@catalog[className]).appendTo(@el)
      @$el.dropdown()
      @