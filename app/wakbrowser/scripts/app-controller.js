(function() {
  define(['../../../../wakbone/scripts/core/helpers'], function(helpers) {
    var AppController;
    return AppController = (function() {
      function AppController(catalog, colGrid, welcome, browse, modelDetail) {
        this.catalog = catalog;
        this.colGrid = colGrid;
        this.welcome = welcome;
        this.browse = browse;
        this.modelDetail = modelDetail;
      }

      AppController.prototype._hideAllExcept = function(show) {
        this.welcome.hideWithStyle();
        switch (show) {
          case 'detail':
            this.colGrid.$el.hide();
            return this.modelDetail.$el.show();
          case 'col':
            this.modelDetail.$el.hide();
            return this.colGrid.$el.show();
        }
      };

      AppController.prototype.navToCollection = function(dataClassName, filterField, filterValue) {
        var dataClass;
        this._hideAllExcept('col');
        dataClass = this.catalog[dataClassName];
        this.colGrid.setDataClass(dataClass);
        dataClass.entities.query.clear();
        if (filterField != null) {
          dataClass.entities.query.where(filterField + '=' + filterValue);
        }
        dataClass.entities.fetch({
          reset: true
        });
        return this;
      };

      AppController.prototype._ensureModel = function(colName, id) {
        var col, model;
        col = this.catalog[colName].entities;
        if (col == null) {
          throw 'Collection ' + colName + ' not found ';
        }
        model = col.get(id);
        if (model != null) {
          return helpers.resolvedPromise(model);
        } else {
          model = new col.model({
            id: id
          });
          return model.fetch().then(function() {
            return model;
          });
        }
      };

      AppController.prototype.navToModel = function(colName, id) {
        var _this = this;
        this._hideAllExcept('detail');
        return this._ensureModel(colName, id).done(function(model) {
          if (model == null) {
            throw 'Model #' + id + ' of collection ' + colName + ' not found ';
          }
          _this.modelDetail.model = model;
          return _this.modelDetail.render();
        });
      };

      return AppController;

    })();
  });

}).call(this);
