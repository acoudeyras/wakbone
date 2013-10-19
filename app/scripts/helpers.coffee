'use strict'
define [], ->

	Function::property = (prop, desc) ->
  		Object.defineProperty @prototype, prop, desc

  	Function::getter = (prop, getFunc) ->
  		Object.defineProperty @prototype, prop,
  			get: getFunc

	log: (message) ->
		console.log message
