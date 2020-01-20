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
* [mock-req-res](https://www.npmjs.com/package/mock-req-res) to stub and spy req and res objects for middleware testing,
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
	

**In your terminal, navigate to the "github-node" directory that contains the docker-compose.yaml file and execute the following command:**

`docker-compose up` or `docker-compose up -d` for detached mode. (This may take a few minutes the first time)

* The Api will be exposed on port **3000** of your local machine


### * To run or debug using the IDE:

In a terminal, navigate to the root folder (which contains index.js) and run `node index` or `npm run`


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
    **NOTE:** Since unauthenticated requests to the Github API are limited to 60 per hour. A github user has been created (testgithub-node) and it's credentials are stored in config.js (**username** and **personal access token**). These credentials are used to make authenticated requests to the Github API, thus allowing 5000 requests per hour. 


5. **test**
    The test folder is structured similarly to the project structure. Each component has it's own test file.
    **Every test has a detailed description on what it is testing**
    
    * repositoryRoutes.js contains integration tests which test the whole flow of the api.
    * repositoryController.js contains unit tests for the controller component. 
    * cache.js contains unit tests for the cache component.
    * apiService.js contains unit tests for the main service component of the application.
    * githubService.js contains unit tests for the component which makes HTTP requests with Github

    **Running the tests:**
    * in a terminal, navigate to the **github-node** directory and run `npm test`

**Basic Flow**

When a request is made to the **/api/user/:username** endpoint, it gets picked up by the route specified in **repositoryRoutes.js**. In this step, request validation (checks for application/json header) and cache middleware are called. If a response for the specified username exists in cache, the controller is not called. If it is not cached, the **repositoryController** **getUserRepositoryInfo** method is then called. 

The controller method basically takes the **username** parameter and calls the service layer, specifically the **apiService.getUserRepositoryInfo** method.

This method is tasked with building the response and makes use of another service **(githubService)** to request repository and branch data from Github. 

After the data is retrieved, the response is build and served back to the client.
 

## Teardown the docker environment

To teardown the docker containers, images and volumes, simply go back to the directory containing the docker-compose.yaml file and execute `docker-compose down` followed by `docker system prune -a --volumes`.
This will delete all stopped containers, and images and volumes not currently being used so remember to watch out for any other docker resources you may need so they don't get tore down.
