# COMP5014_PROJECT
This is a repository for COMP5014 project.

## Requirements
Bellow are the software requirements for developing the application:

- Node 14 or higher
- [Docker](https://www.docker.com/) and [docker compose](https://docs.docker.com/compose/) for running the cypress tests.

## Quick setup
You can use docker, and the provided npm commands, to quickly get started with developing and testing the application.

First, make sure to have all dependencies installed by running:

```
npm run install
```

For starting the two servers, both for the frontend app and the backend app, and the mysql database, use:

```
docker-compose up -d
```

Docker-compose will start everything and allow you to connect to the apps and the database.

Wait around a minute for everything to get started, then visit [http://localhost:8080](http://localhost:8080) for the backend application or [http://localhost:8081](http://localhost:8081) for the frontend application. The database is available at localhost:3306. The username is `root` and password for the database is `comp4004`. 

Use this command to connect to database from terminal: 
`docker exec -it comp5014_project_db_1 mysql -uroot -p`

Any code you write will automatically restart the servers, so you should never have to check if your code is up to date. The server may crash due to code crashes or build failures, if this happens and any of the sites are unavailable, rerun the commands and they will be restarted.

You can validate the code style of your code with:

```
npm run lint
```

You can run the unit tests using:

```
npm run test
```

This will not check for coverage, you can do so with:

```
npm run test:coverage
```

Finally, you can run the cucumber-cypress tests using:

```
npm run test:cypress
```

This requires both application to be started with docker.

## Developing the frontend
The frontend code is stored in [/src/frontend](/src/frontend). It is developed with React and tested with jest.

You can use this command for starting the frontend server without docker:

```
npm run start:frontend
```

This command allows you to run the frontend tests independently:

```
npm run test:frontend
```

If you need the coverage from those tests, use: 

```
npm run test:frontend:coverage
```


## Developing the backend
The backend code is stored in [/src/backend](/src/backend). It is developed with express and tested with jest.

You can use this command for starting the backend server without docker:

```
npm run start:backend
```

This command allows you to run the backend tests independently:

```
npm run test:backend
```

If you need the coverage from those tests, use: 

```
npm run test:backend:coverage
```

## Writing cucumber tests
The application is tested with cucumber, and the tests are executed using cypress.

Feature files should be added to the [/cypress/integration](/cypress/integration) folder. You can then add the step definition as javascript files in the [/cypress/integration/common](/cypress/integration/common) folder. Any file added there will automatically be parsed by the system.

Make sure to have the entire system started using docker when trying to execute cucumber tests as it tests our application end-to-end.

The test can be executed quickly using

```
npm run test:cypress
```

This runs the tests silently however, to start the cypress IDE and debug your tests, use:

```
npx cypress open
```

The following tutorials will be useful for writing features and step definitions: https://docs.cypress.io/guides/getting-started/writing-your-first-test.html and https://github.com/TheBrainFamily/cypress-cucumber-preprocessor.
