define ['../../../../wakbone/scripts/core/helpers'], (helpers) ->

  class AppController
    constructor: (@catalog, @colGrid, @welcome, @browse, @ModelDetail, @$detail) ->

    _hideAllExcept: (show)->
      @welcome.hideWithStyle()
      switch show
        when 'detail'
          @colGrid.$el.hide()
          @$detail.show()
        when 'col'
          @$detail.hide()
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
        new @ModelDetail(
          el: @$detail
          model: model
        )
      )
