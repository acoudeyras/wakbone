(function() {
  define(['../../../../wakbone/scripts/views/backgrid/backgrid-adapter', 'marionette'], function(BackgridAdapter) {
    var CollectionGrid;
    return CollectionGrid = Backbone.View.extend({
      setCol: function(collection) {
        this.collection = collection;
        return this.render();
      },
      render: function() {
        var grid, paginator;
        this.$el.empty();
        if (!this.collection) {
          return;
        }
        grid = backgridFactory.create(this.collection);
        this.$el.append(grid.render().$el);
        paginator = new Backgrid.Extension.Paginator({
          collection: this.collection
        });
        this.$el.append(paginator.render().$el);
        return this;
      }
    });
  });

}).call(this);
