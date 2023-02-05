# rss-feed-reader

A client/server web app that allows users to create an account, enter and save RSS Feed URLS, and view the feeds.

### Database
It's a good idea to get the db set up first.
* Uses MySQL
* Set up a MySQL instance on port 3306 (you can change this port, but will need to go into db.ts in the backend and reflect those changes)
* host: localhost
* name: root
* password: password
* port: 3306
* database: Create a schema titled 'rss-feed-db'
* Done. The typeorm package will seed the database appropriately for you when you start up the backend server

### Installing

* Make sure yarn is installed on your machine.
* Make sure SQL 
* Navigate to rss-feed-reader/frontend/rss-feed
  * For an all-in-one installation, run ``` npm run initialize ```
* Otherwise, ``` npm install ``` in this folder
* ``` cd ../../backend && yarn ```



### Executing program

* Go to https://cors-anywhere.herokuapp.com/corsdemo and click 'Request temporary access to the demo server".
* Ensure ports 8000 and 3000 are available on your machine (8000 will be backend, 3000 will be frontend)
* ``` npm start ```
  * This uses the concurrently package, so both the express server and react app will be started.

## Authors

Jimmy Blundell  
jblundell123@gmail.com
