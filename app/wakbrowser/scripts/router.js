(function() {
  define(['marionette'], function() {
    var Router;
    return Router = Backbone.Marionette.AppRouter.extend({
      appRoutes: {
        'cols/:colName': 'navToCollection',
        'cols/:colName/:filterField/:fieldValue': 'navToCollection',
        'entities/:entityType/:entityId': 'navToEntity'
      }
    });
  });

}).call(this);
