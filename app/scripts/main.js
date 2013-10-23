(function() {
  require.config({
    paths: {
      jquery: '../bower_components/jquery/jquery',
      underscore: '../bower_components/underscore/underscore',
      backbone: '../bower_components/backbone/backbone',
      'underscore.string': '../bower_components/underscore.string/dist/underscore.string.min',
      moment: '../bower_components/moment/min/moment-with-langs',
      stickit: '../bower_components/backbone.stickit/backbone.stickit'
    },
    shim: {
      backbone: {
        deps: ['underscore', 'jquery']
      },
      'underscore.string': {
        deps: ['underscore']
      },
      stickit: {
        deps: ['backbone']
      }
    }
  });

  require(['wakbone', './views/views'], function(wakbone, _arg) {
    var within;
    within = _arg.within;
    return wakbone.load().done(function(catalog) {
      var emp;
      emp = new catalog.employee.Model({
        id: 1
      });
      return emp.fetch().done(function() {
        within('#wak-container').render(emp, 'firstName').withAn('input').render(emp, 'lastName').withAn('input');
        return emp.on('change:firstName', function() {
          return console.log('changement');
        });
      });
    });
  });

}).call(this);
