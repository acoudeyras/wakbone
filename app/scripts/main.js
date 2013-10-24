(function() {
  require.config({
    paths: {
      jquery: '../bower_components/jquery/jquery',
      underscore: '../bower_components/underscore/underscore',
      backbone: '../bower_components/backbone/backbone',
      'underscore.string': '../bower_components/underscore.string/dist/underscore.string.min',
      moment: '../bower_components/moment/min/moment-with-langs',
      epoxy: '../bower_components/backbone.epoxy/backbone.epoxy'
    },
    shim: {
      underscore: {
        exports: '_'
      },
      backbone: {
        exports: 'Backbone',
        deps: ['underscore', 'jquery']
      },
      'underscore.string': {
        deps: ['underscore']
      }
    }
  });

  require(['wakbone'], function(wakbone) {
    return wakbone.load().done(function(_arg) {
      var catalog, emp, views;
      catalog = _arg.catalog, views = _arg.views;
      emp = new catalog.employee.Model({
        id: 1
      });
      return emp.fetch().done(function() {
        var firstName, firstNameSpan, lastName;
        firstName = views.create.input('First name', 'employee.firstName');
        lastName = views.create.input('Last name', 'employee.lastName');
        firstNameSpan = views.create.text('First name', 'employee.firstName');
        $('body').append(firstName.$el, lastName.$el, firstNameSpan.$el);
        views.bind(firstName, lastName, firstNameSpan).to(emp).inside('body');
        return emp.on('change', function() {
          return console.log('change');
        });
      });
    });
  });

}).call(this);
