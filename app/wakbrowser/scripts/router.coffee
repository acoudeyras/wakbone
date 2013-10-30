define ['marionette'], ->

  Router = Backbone.Marionette.AppRouter.extend
    appRoutes:
      'cols/:colName': 'navToCollection'
      'cols/:colName/:filterField/:fieldValue': 'navToCollection'
      'models/:entityType/:entityId': 'navToModel'