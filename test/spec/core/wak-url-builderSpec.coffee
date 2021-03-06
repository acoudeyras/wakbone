define ['core/wak-url-builder', 'chai'], (UrlBuilder, {expect}) ->

  rootUrl = 'http://localhost:8080'

  urlBuilder = -> new UrlBuilder(rootUrl + '/Person')

  describe 'UrlBuilder', ->

    describe 'url', ->

      it 'without other parameters should concatenate root and entityName', ->
        url = urlBuilder().url
        expect(url).to.equal 'http://localhost:8080/Person'

    describe 'where', ->

      it 'should add $filter query parameter in url', ->
        url = urlBuilder()
          .where('age<10')
          .url
        expect(url).to.equal 'http://localhost:8080/Person?$filter="age<10"'

    describe 'orderBy', ->

      it 'should add $orderby query parameter in url', ->
        url = urlBuilder()
          .orderBy('age' : 'ASC')
          .url
        expect(url).to.equal 'http://localhost:8080/Person?$orderby=age ASC'

      it 'should work with multiple orderby', ->
        url = urlBuilder()
          .orderBy('age' : 'ASC', 'salary' : 'DESC')
          .url
        expect(url).to.equal 'http://localhost:8080/Person?$orderby=age ASC,salary DESC'


    describe 'expand', ->

      it 'should add $expand query parameter in url', ->
        url = urlBuilder()
          .expand('company')
          .url
        expect(url).to.equal 'http://localhost:8080/Person?$expand=company'

      it 'should work with multiple expand', ->
        url = urlBuilder()
          .expand('company', 'manager')
          .url
        expect(url).to.equal 'http://localhost:8080/Person?$expand=company,manager'

    describe 'skip & limit & timeout', ->

      _execEach = (value) ->
        methods = ['limit', 'skip', 'timeout']
        result = {}
        for method in methods
          result[method] = urlBuilder()[method](value).url
        result.allEquals = (expectedUrl) ->
          expect(url).to.equal expectedUrl for method, url of @ when method in methods
        result
          

      it 'should add corresponding query parameter in url', ->
        values = _execEach(100)
        expect(values.limit).to.equal 'http://localhost:8080/Person?$limit=100'
        expect(values.skip).to.equal 'http://localhost:8080/Person?$skip=100'
        expect(values.timeout).to.equal 'http://localhost:8080/Person?$timeout=100'

      it 'should cast string to number if possible', ->
        values = _execEach('100')
        expect(values.limit).to.equal 'http://localhost:8080/Person?$limit=100'
        expect(values.skip).to.equal 'http://localhost:8080/Person?$skip=100'
        expect(values.timeout).to.equal 'http://localhost:8080/Person?$timeout=100'

      it 'should not add a bad parameter but not throw an exception', ->
        values = _execEach('a')
        values.allEquals 'http://localhost:8080/Person'

        values = _execEach(null)
        values.allEquals 'http://localhost:8080/Person'

    describe 'select', ->

      it 'should add selected property in url path', ->
        url = urlBuilder().select('name').url
        expect(url).to.equal 'http://localhost:8080/Person/name'

      it 'should separate multiple selected properties by , in url path', ->
        url = urlBuilder().select('name', 'salary', 'age').url
        expect(url).to.equal 'http://localhost:8080/Person/name,salary,age'

      xit 'could be call multiple times', -> #TODO
        url = urlBuilder().select('name').select('salary').select('age').url
        expect(url).to.equal 'http://localhost:8080/Person/name,salary,age'

    describe 'clearSelect', ->

      it 'should remove selected properties', ->
        url = urlBuilder().select('name').clearSelect().url
        expect(url).to.equal 'http://localhost:8080/Person'
        url = urlBuilder().select('name', 'age').clearSelect().url
        expect(url).to.equal 'http://localhost:8080/Person'


    describe 'distinct', ->

      it 'should add $distinct query parameter in url', ->
        url = urlBuilder().distinct('name').url
        expect(url).to.equal 'http://localhost:8080/Person/name?$distinct=true'

      it 'should remove previously added select', ->
        url = urlBuilder().select('age').distinct('name').url
        expect(url).to.equal 'http://localhost:8080/Person/name?$distinct=true'

    describe 'compute', ->

      it 'when just the property name is specified, should add $compute query parameter in url with $all keyword', ->
        url = urlBuilder().compute('name').url
        expect(url).to.equal 'http://localhost:8080/Person/name?$compute=$all'

      it 'when the keyword is specified, should use it', ->
        url = urlBuilder().compute('name', 'count').url
        expect(url).to.equal 'http://localhost:8080/Person/name?$compute=count'
    
      it 'when and invalid keyword is specified, should throw an exception', ->
        expect( -> urlBuilder().compute('name', 'diff')).to.throw Error

    describe 'key', ->

      it 'should add the entity key in url', ->
        url = urlBuilder().key('123').url
        expect(url).to.equal 'http://localhost:8080/Person(123)'

    describe 'everything combined', ->

      it 'should work', -> #TODO

        urlBuilder()
          
