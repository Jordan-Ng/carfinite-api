# carfinite API

## setting up development environment

- install mySQL on your local machine (please google this)
- install mySQL GUI (graphical user interface) on your machine. this will allow you to view the data in the database interactively (i.e Sequel Ace for macOS, mySQL workbench for windows)
- install Postman (this is used for testing the API endpoints)

- create database in mySQL named "carfinite" (please google this)
- connect mySQL GUI to carfinite database (please google this)


- setting up project environment

```
$ npm install    // install dependencies
$ npm run clean     // recreate/create tables and then starts the application
```

- refresh mySQL GUI. verify that the tables have been created
- in a new terminal, run the following:

```
$ npm run db:seed   // seed database with placeholder data
```

- refresh mySQL GUI. verify that tables now have placeholder data
- use postman to interact with the API root endpoint to verify that the application is running correctly (or check your browser)

## Housekeeping

- Please checkout a branch for development of features. Do not commit and push straight to the "main" branch. when the feature is tested, verified, and ready to be merged, open a pull request on github.
- Please write meaningful commit messages before pushing upstream to project repository (this will be helpful us to backtrack and resolve issues in the future)
- I will be using this template, but feel free to use a different template if you prefer

```
    git commit -m
    " featureOrBug - shortDescriptionOfFeatureOrBug
    - what you did + where you did it (1)
    - what you did + where you did it (2)
    ...
    "
```





