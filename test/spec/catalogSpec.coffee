define ['catalog', 'chai', 'test-helpers'], (Catalog, {expect}, helpers)->

	before (done) -> helpers.init done

	describe 'load', ->

		it 'should load catalog', (done) ->
			Catalog.load().done (catalog) ->
				expect(catalog).not.to.be.null
				done()

	describe 'models', ->

		it 'should contains all models', ->
			modelNames = Object.keys helpers.catalog.models
			expect(modelNames.length).to.equal 4

		it 'should have models indexed by className', ->
			expect(helpers.catalog.models.Employee).not.to.be.undefined
			expect(helpers.catalog.models.Company).not.to.be.undefined