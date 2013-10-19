wakbone
=======
See Trello board https://trello.com/b/UUdUdR6F/wakbone for issues and progress


RestQuery
=========
Example:
url = new RestQuery('http://localhost:8080', 'Person')
	.select('company')
	.expand('company')
	.orderby('age' : 1, 'salary' : 0)
	.where('age > 10')
	.url