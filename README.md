wakbone
=======
See Trello board https://trello.com/b/UUdUdR6F/wakbone for issues and progress

Prerequisite
=========
* npm
* proxy configured for npm -> npm config set proxy http://{proxyserver}:{port}
* Yeoman (bower and grunt) -> npm install -g yo
* Wakanda 6

Getting started (Dev)
=========
* Clone the projet on your desktop
* Go to the root folder of the project
* npm install
* bower install

To run tests
=========
* Open and start solution (TODO)
* grunt


RestQuery
=========
Example:
url = new RestQuery('http://localhost:8080', 'Person')
	.select('company')
	.expand('company')
	.orderby('age' : 1, 'salary' : 0)
	.where('age > 10')
	.url