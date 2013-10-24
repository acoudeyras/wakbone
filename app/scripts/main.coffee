require.config(
  paths:
    jquery: '../bower_components/jquery/jquery'
    underscore: '../bower_components/underscore/underscore'
    backbone: '../bower_components/backbone/backbone'
    'underscore.string': '../bower_components/underscore.string/dist/underscore.string.min'
    moment: '../bower_components/moment/min/moment-with-langs'
    epoxy: '../bower_components/backbone.epoxy/backbone.epoxy'
  shim:
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
      firstNameSpan = views.create.text 'First name', 'employee.firstName'

      $('body').append firstName.$el, lastName.$el, firstNameSpan.$el

      views.bind(firstName, lastName, firstNameSpan).to(emp).inside('body')

      emp.on 'change', ->
        console.log 'change'


