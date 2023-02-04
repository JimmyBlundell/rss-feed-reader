# rss-feed-reader

A client/server web app that allows users to create an account, enter and save RSS Feed URLS, and view the feeds.

### Installing

* Make sure yarn is installed on your machine.
* Navigate to rss-feed-reader/frontend/rss-feed
  * For an all-in-one installation, run ``` npm run intialize ```
* Otherwise, ``` npm install ``` in this folder
* ``` cd ../../backend && yarn ```

### Executing program

* Ensure ports 8000 and 3000 are available on your machine (8000 will be backend, 3000 will be frontend)
* ``` npm start ```
  * This uses the concurrently package, so both the express server and react app will be started.

## Authors

Jimmy Blundell  
jblundell123@gmail.com
