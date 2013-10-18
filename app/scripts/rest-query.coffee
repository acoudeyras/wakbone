define ['./helpers'], (helpers)->
	class RestQuery
		select: (select) ->
			helpers.log select
		where: (clause) ->
		orderBy: (clause) ->
		distinct: ->
		compute: (compute) ->
		url: -> 'genial2'
		fetch: ->