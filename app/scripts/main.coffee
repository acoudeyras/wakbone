require.config(
  paths:
    jquery: '../bower_components/jquery/jquery'
    bootstrap: '../bower_components/bootstrap/dist/js/bootstrap'
    underscore: '../bower_components/underscore/underscore'
    backbone: '../bower_components/backbone/backbone'
    'underscore.string': '../bower_components/underscore.string/dist/underscore.string.min'
    moment: '../bower_components/moment/min/moment-with-langs'
    epoxy: '../bower_components/backbone.epoxy/backbone.epoxy'
    backgrid: '../bower_components/backgrid/lib/backgrid'
  shim:
    bootstrap:
      deps ['jquery']
    underscore:
      exports: '_'
    backbone:
      exports: 'Backbone'
      deps: ['underscore', 'jquery']
    'underscore.string':
      deps: ['underscore']
)

require ['wakbone'], (wakbone) ->  

  wakbone.load().done ({catalog, views}) ->

    emp = new catalog.employee.Model id:1
    emp.fetch().done ->

      firstName = views.create.input 'First name', 'employee.firstName'
      lastName = views.create.input 'Last name', 'employee.lastName'
      firstNameSpan = views.create.text 'firstName', 'employee.firstName'

      elem = views.create.create(
        '<label>First name:</label><input type="text" class="first-name2">',
        'input.first-name2': 'employee.firstName'
      )
      $('body').append firstName.$el, lastName.$el, firstNameSpan.$el, elem.$el

      views.bind(firstName, lastName, firstNameSpan, elem).to(emp).inside('body')

      emp.on 'change', ->
        console.log 'change'


