# Graphroots

Graph QL is quickly becoming the application layer protocol of choice for crud operations,
its ease of use makes it ideal for quickly spinning up servers for querying data.

With this project I'd like to build an abstraction layer on top of Graph QL which offers Graph QL as a service;
to this end I'm trying to build a server that developers can use to significantly streamline the Graph QL deployment process.
For a developer, it should be as easy as uploading a Graph QL schema, writing resolvers for the schema,
and then hitting a deploy button.

## Running the project locally

- Clone or fork the project
- run `npm install` to make sure you have all the dependencies installed
- make sure you have docker and docker-compose installed on your machine and that you're using linux containers
- Create a file named .env in the root of your project and add the following, replace the curly brackets and text with a guid or random number
```
PORT=4000
SESSION_SECRET={put any guid or random string here}
```
- run `npm run dev:docker` to start the application and a redis server in docker containers. Any changes you make to any files will cause the server to reload inside the docker container.

**Note: It is possible to run the project without docker compose by running `npm run dev`. However, if you do this you will have to run your own redis container and make sure your server can talk to it on localhost**

## Debugging

I haven't figured out how to run the debugger inside the docker container yet so debugging is tbd.

## Contributing

If you want to contribute please fork the project and make a pull request. Let me know what you're working on so that there aren't multiple people working on the same thing. You can head on over to the [work tracking board](https://dev.azure.com/roseitz/Graphroots/_workitems/recentlyupdated) to see what needs doing.

For any PR you make please write unit and integration tests where it makes sense

## Architecture

### High Level

On a high level this project is a server which listens for post requests of Graph QL files (resolvers and schema) from the client. The server then saves these files in an http session backed by a redis store. The files are stored as strings with some additional metadata. The client can also specify a project name when files are uploaded, so that multiple Graph QL projects can be in progress at the same time.

When the deployment endpoint is called, the resolvers and schema are retrieved from the session and used to create an express Graph QL server which, is then deployed to a cloud provider of the users choice (currently only Azure is supported)

### Details

The server follows a basic mvc pattern. The index.ts file serves to start the server and server.ts wraps express and defines the routes and middleware. The controllers folder holds all of the controllers for the server, as well as functions to validate models sent from the client. The GraphQL controller and DeploymentController are fairly self explanatory, while the info controller returns information about a developers currently uploaded Graph QL projects.


Besides the server there are basically two modules: the generator and the deployer. The generator is responsible for outputting a zip file given a list of code files, and the deployer is responsible for creating the cloud resources needed to support a Graph QL server as well as deploying the zip file output by the generator. Both the deployer and generator are represented by interfaces, the end goal being that a deployer and generator can be chosen at runtime based on the clooud provider/programming language.

<pre>
                #####################                ################
                #                   #                #              #
Code Files ->   #     Generator     # -> Zip File -> #   Deployer   # -> Cloud
                #                   #                #              #
                #                   #                #              #
                #####################                ################

</pre>
