define ['backbone'], ->

	WakCollection = Backbone.Collection.extend(

	)

###

	Collection = WakCollection.extend(
			model: model
			url: dataClass.dataURI
			$name: dataClass.collectionName
			id: dataClass.collectionName
			$catalog: catalog
	)	
###


	create: (dataClass, model, catalog) ->
		