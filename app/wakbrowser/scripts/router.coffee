define ['marionette'], ->

  Router = Backbone.Marionette.AppRouter.extend
    appRoutes:
      'cols/:colName': 'navToCollection'
      'cols/:colName/:filterField/:fieldValue': 'navToCollection'
      'entities/:entityType/:entityId': 'navToEntity'