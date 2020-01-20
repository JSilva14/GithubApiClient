# Github-Node

Express API to retrieve information about Github user repositories. 

NPM packages used:
* [express](https://www.npmjs.com/package/express) to set up the routes,
* [express-validator](https://www.npmjs.com/package/express-validator) to validate the requests,
* [memory-cache](https://www.npmjs.com/package/memory-cache) to cache api responses,
* [axios](https://www.npmjs.com/package/memory-cache) to make requests to the Github API;
Testing tools:
* [mocha](https://www.npmjs.com/package/mocha) as main testing framework,
* [chai](https://www.npmjs.com/package/chai) as assertion library,
* [chai-http](https://www.npmjs.com/package/chai-http) to test the api endpoints
* [mock-req-res](https://www.npmjs.com/package/mock-req-res) to mock req and res objects for middleware testing,
* [sinon](https://www.npmjs.com/package/sinon) to spy method calls;

## Prerequisites

* Docker Engine (Recommended version 19.03.5):
	* [Docker for Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
	* [Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/install/)
	* [Docker Destop for Mac](https://docs.docker.com/docker-for-mac/install/)
    * [Docker Compose](https://docs.docker.com/compose/install/) (Recommended version 1.25.0)

#### For local setup
* [Node LTS](https://nodejs.org/en/)
* **NPM** - included with Node LTS


## Getting Started

Clone the repository into your prefered directory.


## Deployment

### * To execute the docker environment: 

**PRE-DEPLOYMENT**

1. Make sure there are no processes or other docker containers using port 3000 of your machine.
	- In a terminal, execute `docker ps` to list any active containers.
	- If there are active containers using the aforementioned ports, perform `docker stop <CONTAINER ID>`

2. Make sure to fully remove any old docker artifacts of this application (containers, images, volumes and networks).
	- The easiest way to do this is to `docker stop` all containers that are related to this application and then perform `docker system prune -a --volumes` 
	

**In your terminal, navigate to the "deployment" directory that contains the docker-compose.yaml file and execute the following command:**

`docker-compose up` or `docker-compose up -d` for detached mode. (This may take a few minutes the first time)

* The Api will be exposed on port **3000** of your local machine


### * To run or debug using the IDE:

In a terminal, navigate to the root folder (which contains index.js) and run `node index`


## How to use

After deploying the API open a browser or Postman and make a request to the following endpoint:
 	
	- GET User Repository Info (http://localhost:3000/user/{Github Username})
        - Headers : {Accept: application/json}
		- Retrieves a list of repositories for the provided username.
		- Ex: GET http://localhost:3000/user/octocat


## Code Breakdown

**Project Structure:**

The project is split into 5 main components:

1. **index.js**
    * App entry point. Contains the basic express server setup.
    * Initializes the server on the port specified in config.api.PORT. 
    * Routes all requests made to **/api** to repositoryRoutes.js.

2. **config**
    * config.js - Contains configuration data for the API and data used to make requests to the Github API

3. **api**
    * **routes**
        * **repositoryRoutes.js** - Contains a single route which calls the request validation and cache middlewares as well as the appropriate controller.

    * **middleware**
        * **cache.js** - Contains response caching logic used to store the responses in a memory cache using the username request parameter as key. For each new request, it checks if a response is already cached for the provided username parameter, which avoids having to make a new request to the Github API. 

        * **requestValidator.js** - Contains request validation logic. Builds an appropriate error response if the request is not valid.

    * **controllers**
        * **repositoryController.js** - Contains a single controller which is called when a request is made to "/api/user/:username". The controller calls the service layer to get repository data about the specified user. 

4. **service**
    * **apiService.js** - The service layer which is called by the controller. Contains a `getUserRepositoryInfo` method which builds the object with the user's repository data and returns it to the controller to be send as a response. It uses `githubService` to get information about user repositories and branches.

    * **githubService.js** - Contains the actual methods that perform HTTP requests to the Github API.


5. **test**
    
