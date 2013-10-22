'use strict'
define ['core/filter-builder', 'chai', 'test-helpers'], (FilterBuilder, {expect}, helpers)->

  before (done) -> helpers.init @, done

  describe 'FilterBuilder', ->

    before ->
      @empFilter = =>
        new FilterBuilder @catalog.employee

    it 'should work', ->

      filter = @empFilter()
        .add('firstName', 'begin', 'a')
        .build()
      #expect(filter).to.equal 'firstName begin "a"'

