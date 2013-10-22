'use strict'
define ['core/orderby-parser', 'chai'], (parse, {expect}) ->

  describe 'with one string', ->

    it 'should parse one order without direction (default is ASC)', ->
      expect(parse ['firstName']).to.deep.equal
        firstName: 'ASC'

    it 'should parse one order with a direction', ->
      expect(parse ['firstName ASC']).to.deep.equal
        firstName: 'ASC'
      expect(parse ['firstName DESC']).to.deep.equal
        firstName: 'DESC'

    it 'should parse multiple orderby correctly', ->
      expect(parse ['firstName, lastName DESC, age ASC']).to.deep.equal
        firstName: 'ASC'
        lastName: 'DESC'
        age: 'ASC'

  describe 'with multiple strings', ->

    it 'should parse all members correctly', ->
      expect(parse ['firstName', 'lastName DESC']).to.deep.equal
        firstName: 'ASC'
        lastName: 'DESC'

  describe 'with an object', ->

    it 'should parse on order by', ->
      expect(parse [firstName: 'ASC']).to.deep.equal
        firstName: 'ASC'

    it 'should be permissive on ASC values', ->
      expect(parse [firstName: true, lastName: 1, age:'asc']).to.deep.equal
        firstName: 'ASC'
        lastName: 'ASC'
        age: 'ASC'

    it 'should be permissive on DESC values', ->
      expect(parse [firstName: false, lastName: -1, age:'desc', birthDate: 0]).to.deep.equal
        firstName: 'DESC'
        lastName: 'DESC'
        age: 'DESC'
        birthDate: 'DESC'

    it 'should parse multiple order by', ->
      expect(parse [firstName: 'ASC', lastName: -1, age: true]).to.deep.equal
        firstName: 'ASC'
        lastName: 'DESC'
        age: 'ASC'