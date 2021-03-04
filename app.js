const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Access dot env variables
dotenv.config();

// routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commonRoutes = require('./routes/common');
const mailRoutes = require('./routes/email');

// app
const app = express();

// static folders
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads', 'images')));
app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads', 'others')));
app.use('/uploads/gallery', express.static(path.join(__dirname, 'uploads', 'gallery')));

// global middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// global headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //or specific separated by commas
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/auth', authRoutes);
app.use('/content', postRoutes);
app.use('/common', commonRoutes);
// app.use('/email', mailRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    res.status(error.statusCode || 500);
    res.json({
        message: error.message,
        data: error.data,
        success: false,
        vlderror: Array.isArray(error.data) && error.data.length > 0 ? true : false
    });
});

mongoose.connect(process.env.MONGO_DB_URI, JSON.parse(process.env.MONGO_DB_OPTIONS))
    .then(res => {
        app.listen(process.env.APP_PORT || 3000);
        console.log("API running on port: ", process.env.APP_PORT);
    })
    .catch(err => {
        console.log(err);
    });
