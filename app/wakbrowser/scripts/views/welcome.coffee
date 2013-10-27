define ['marionette'], ->

  Welcome = Backbone.View.extend
    initialize: ({@catalog}) ->
      Backbone.View::initialize.apply @, arguments  
    events:
        'click li': 'select'
    _renderItem: (dataClass) ->
      name = dataClass.name
      $("""<li><a href="#cols/#{name}">#{name}</a></li>""")
    render: ->
      @$el.empty()
      for className in @catalog.$classNames
        @_renderItem(@catalog[className]).appendTo(@el)
      @$el.dropdown()
      @
    showWithStyle: ->
      return if @isHidden
      @$el.parent().show()
      @$el.parent().addClass 'animated bounceInDown'
      @
    hideWithStyle: ->
      return if @isHidden
      @$el.parent().addClass 'animated bounceOutUp'
      @isHidden = true
      setTimeout(=>
        @$el.parent().hide()
      , 600)

    select: (event)->
      selected = $(event.currentTarget).find('a').text()
      @trigger('change', @catalog[selected])
      @
  