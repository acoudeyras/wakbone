define ['../../../../wakbone/scripts/core/helpers'], (helpers) ->

  class AppController
    constructor: (@catalog, @colGrid, @welcome, @browse, @detail) ->

    _hideAllExcept: (show)->
      @welcome.hideWithStyle()
      switch show
        when 'detail'
          @colGrid.$el.hide()
          #@detail.$el.show()
        when 'col'
          #@detail.$el.hide()
          @colGrid.$el.show()
      

    navToCollection: (dataClassName, filterField, filterValue) ->
      @_hideAllExcept('col')
      dataClass = @catalog[dataClassName]
      @colGrid.setDataClass dataClass
      #dataClass.entities.clearQuery()
      #if (filterField)
      #  selectedCol.query filterField, filterValue
      dataClass.entities.fetch(reset: true)
      @

    _ensureModel: (colName, id) ->
      col = @catalog.cols[colName]
      throw 'Collection ' + colName + ' not found ' if not col?
      model = col.get id
      if model?
        helpers.promise.val model
      else
        model = new col.model(id:id)
        model.fetch().then(-> model)
    navToEntity: (colName, id) ->
      @_hideAllExcept('detail')
      @_ensureModel(colName, id).done( (model) =>
        throw 'Model #' + id + ' of collection ' + colName + ' not found ' if not model?
        @detail.model = model
        @detail.render()
      )
