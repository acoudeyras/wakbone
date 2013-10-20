'use strict'
define ['./underscore-ext'], (_ext) ->

  Function::property = (prop, desc) ->
    Object.defineProperty @prototype, prop, desc

  Function::getter = (prop, getFunc) ->
    Object.defineProperty @prototype, prop,
      get: getFunc

  Function::lazyval = (prop, getter) ->
    Object.defineProperty @prototype, prop,
      get: ->
        privateProp =  '__' + prop
        return @[privateProp] if @[privateProp]?
        @[privateProp] = getter.apply(@)

  log: (message) ->
    console.log message
  throw: (message, Type=Error) ->
    throw new Type(message)
  throwIf: (predicate, message) ->
    if predicate
      @throw message