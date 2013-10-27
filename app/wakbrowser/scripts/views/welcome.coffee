define [], ->
  Welcome = Backbone.View.extend
    events:
        'click li': 'select'
    _renderItem: (col) -> $("""<li><a href="#">#{col.$name}</a></li>""")
    render: ->
      @$el.empty()
      _.each @collection, (col) =>
        @_renderItem(col).appendTo(@el)
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
      @trigger('change', @collection[selected])
      @
  