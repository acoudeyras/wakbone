define ['rest-query'], (RestQuery) ->



	describe 'RestQuery', ->

		describe 'select', ->

			it 'should do stuff', ->
				q = new RestQuery()
				q.select 'coucou'
				console.log q.url()
				q.url().should.equal 'genial2'