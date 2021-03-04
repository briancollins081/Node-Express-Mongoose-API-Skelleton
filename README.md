# Simple-react-redux-toolkit-project-backend

Node.js Express.js Mongoose.js REST API

This is the backend that will be used to update the redux state on the fronend app

It is created with all the functions in place

In the `app.js` which is the entry point, you can configure your mongo db `URI` either to `localhost` or to mongodb cloud(atlas database)

Remember to create your .env file for any variables that are used in the app which include:

The emailing bit was still pending but can be done **(TODO)**

  `
  **auth**
  
  JWT_SECRET='JWT SECRET STRING GOES HERE FOR AUTH'

  **databases**
  
  MONGO_DB_URI='MONGO DB URI FOR THE DATABASE GOES HER - mongodb://127.0.0.1:27017/redux-blog-app'
  MONGO_DB_OPTIONS = '{"useNewUrlParser":true,"useUnifiedTopology":true,"useCreateIndex": true, "useFindAndModify": true}'

  **ports**
  
  APP_PORT = 3010

  **Emailing**
  
  EMAIL_HOST=
  EMAIL_PORT=
  EMAIL_USER=
  EMAIL_PASS=
  EMAIL_FROM_USER_NAME=
  EMAIL_FROM_EMAIL=
