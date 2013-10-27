(function() {
  define(['../wakbone/helpers'], function(helpers) {
    var AppController;
    return AppController = (function() {
      function AppController(catalog, colGrid, welcome, browse, detail) {
        this.catalog = catalog;
        this.colGrid = colGrid;
        this.welcome = welcome;
        this.browse = browse;
        this.detail = detail;
      }

      AppController.prototype._hideAllExcept = function(show) {
        this.welcome.hideWithStyle();
        switch (show) {
          case 'detail':
            this.colGrid.$el.hide();
            return this.detail.$el.show();
          case 'col':
            this.detail.$el.hide();
            return this.colGrid.$el.show();
        }
      };

      AppController.prototype.navToCollection = function(colName, filterField, filterValue) {
        var selectedCol;
        this._hideAllExcept('col');
        selectedCol = this.catalog.cols[colName];
        this.colGrid.setCol(selectedCol);
        selectedCol.clearQuery();
        if (filterField) {
          selectedCol.query(filterField, filterValue);
        }
        selectedCol.fetch({
          reset: true
        });
        return this;
      };

      AppController.prototype._ensureModel = function(colName, id) {
        var col, model;
        col = this.catalog.cols[colName];
        if (col == null) {
          throw 'Collection ' + colName + ' not found ';
        }
        model = col.get(id);
        if (model != null) {
          return helpers.promise.val(model);
        } else {
          model = new col.model({
            id: id
          });
          return model.fetch().then(function() {
            return model;
          });
        }
      };

      AppController.prototype.navToEntity = function(colName, id) {
        var _this = this;
        this._hideAllExcept('detail');
        return this._ensureModel(colName, id).done(function(model) {
          if (model == null) {
            throw 'Model #' + id + ' of collection ' + colName + ' not found ';
          }
          _this.detail.model = model;
          return _this.detail.render();
        });
      };

      return AppController;

    })();
  });

}).call(this);
