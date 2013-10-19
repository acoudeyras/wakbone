define ['catalog', 'chai'], (catalogLoader, {expect})->

	catalog = null
	before (done) ->
		catalogLoader.load().done (loadedCatalog) -> 
			catalog = loadedCatalog
			done()

	describe 'load', ->

		it 'should load catalog', (done) ->
			catalogLoader.load().done (catalog) ->
				expect(catalog).not.to.be.null
				done()

	describe 'models', ->

		it 'should contains all models', ->
			modelNames = Object.keys catalog.models
			expect(modelNames.length).to.equal 4

		it 'should have models indexed by className', ->
			expect(catalog.models.Employee).not.to.be.undefined
			expect(catalog.models.Company).not.to.be.undefined