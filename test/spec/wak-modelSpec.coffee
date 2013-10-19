define ['catalog', 'chai', 'test-helpers'], (Catalog, {expect}, helpers) ->

	before (done) -> helpers.init done

	describe 'static properties', ->

		it 'should have a valid className', ->
			expect(helpers.catalog.models.Employee.className).to.equal 'Employee'
			expect(helpers.catalog.models.Company.className).to.equal 'Company'

		it 'should have a reference to the catalog', ->
			expect(helpers.catalog.models.Employee.catalog).to.equal helpers.catalog
			expect(helpers.catalog.models.Company.catalog).to.equal helpers.catalog

		xit 'should have a reference to its metadata', ->
			#TODO definition voir si utile et besoin d'abstraction