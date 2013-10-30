define ['../../../../wakbone/scripts/core/helpers'], (helpers) ->

  class AppController
    constructor: (@catalog, @colGrid, @welcome, @browse, @modelDetail) ->

    _hideAllExcept: (show)->
      @welcome.hideWithStyle()
      switch show
        when 'detail'
          @colGrid.$el.hide()
          @modelDetail.$el.show()
        when 'col'
          @modelDetail.$el.hide()
          @colGrid.$el.show()

    navToCollection: (dataClassName, filterField, filterValue) ->
      @_hideAllExcept('col')
      dataClass = @catalog[dataClassName]
      @colGrid.setDataClass dataClass
      dataClass.entities.query.clear()
      if filterField?
        dataClass.entities.query.where filterField + '=' + filterValue
      dataClass.entities.fetch(reset: true)
      @

    _ensureModel: (colName, id) ->
      col = @catalog[colName].entities
      throw 'Collection ' + colName + ' not found ' if not col?
      model = col.get id
      if model?
        helpers.resolvedPromise model
      else
        model = new col.model(id:id)
        model.fetch().then(-> model)
    navToModel: (colName, id) ->
      @_hideAllExcept('detail')
      @_ensureModel(colName, id).done( (model) =>
        throw 'Model #' + id + ' of collection ' + colName + ' not found ' if not model?
        @modelDetail.model = model
        @modelDetail.render()
      )
