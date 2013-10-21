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

To build
=========
* Open and start solution (TODO)
* grunt karma:continuous build

To Dev
========
* Open and start solution (TODO)
* grunt karma:unit watch


RestQuery
=========
Example:
url = new RestQuery('http://localhost:8080', 'Person')
	.select('company')
	.expand('company')
	.orderby('age' : 1, 'salary' : 0)
	.where('age > 10')
	.url