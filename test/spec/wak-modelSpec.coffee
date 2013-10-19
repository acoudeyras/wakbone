define ['catalog', 'chai'], (catalogLoader, {expect}) ->

	catalog = null
	before (done) ->
		catalogLoader.load().done (loadedCatalog) -> 
			catalog = loadedCatalog
			done()

	describe 'static properties', ->

		it 'should have a valid className', ->
			expect(catalog.models.Employee.className).to.equal 'Employee'
			expect(catalog.models.Company.className).to.equal 'Company'

		it 'should have a reference to the catalog', ->
			expect(catalog.models.Employee.catalog).to.equal catalog
			expect(catalog.models.Company.catalog).to.equal catalog

		xit 'should have a reference to its metadata', ->
			#TODO definition voir si utile et besoin d'abstraction