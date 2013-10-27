define ['marionette'], ->

  BrowseDropDownView = Backbone.View.extend
    initialize: ({@catalog}) ->
      Backbone.View::initialize.apply @, arguments
    events:
        "click li": "select"
    _renderItem: (dataClass) ->
      name = dataClass.className
      $("""<li><a href="#cols/#{name}">#{name}</a></li>""")
    highlight: ->
      @$el.parent().addClass 'animated shake'
    render: ->
      @$el.empty()
      _.each @catalog.$classNames, (className) =>
        @_renderItem(@catalog[className]).appendTo(@el)
      @$el.dropdown()
      @
    select: (event)->
      selected = $(event.currentTarget).find('a').text()
      @trigger('change', @catalog[selected])
      @