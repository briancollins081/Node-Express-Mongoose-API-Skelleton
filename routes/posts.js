const express = require('express');
const { body } = require('express-validator');


const Category = require('../models/category');
const Location = require('../models/location');
const Post = require('../models/posts');
const Type = require('../models/type');

const postController = require('../controllers/posts');
const { isAuth } = require('../middlewares/auth');
const { imageUploadMiddleware } = require('../middlewares/fileUpload');

const postValidator = [
    body('title')
        .trim()
        .isString()
        .isLength({ min: 10, max: 200 })
        .withMessage('Post title can must be between 10 - 200 alphanumeric characters')
        .custom((value, { req }) => {
            return Post.findOne({ title: value })
                .then(postDoc => {
                    if (postDoc) {
                        return Promise.reject('There is a post with this title!');
                    }
                });
        }),
    body('introduction')
        .trim()
        .isString()
        .isLength({ min: 50, max: 500 })
        .withMessage('Post subtitle can must be between 50 - 500 alphanumeric characters')
        .custom((value, { req }) => {
            return Post.findOne({ introduction: value })
                .then(postDoc => {
                    if (postDoc) {
                        return Promise.reject('There is a post with this subtitle!');
                    }
                });
        }),
    body('body')
        .trim()
        .isString()
        .isLength({ min: 500 })
        .withMessage("Post body must be at least 500 alphanumeric characters"),
    body('type')
        .trim()
        .custom((value, { req }) => {
            return Type.findById(value)
                .then(typeDoc => {
                    if (!typeDoc) {
                        return Promise.reject('There is no type with this name!');
                    }
                });
        })
        .isString(),

    body('category')
        .trim()
        .custom((value, { req }) => {
            return Category.findById(value)
                .then(categoryDoc => {
                    if (!categoryDoc) {
                        return Promise.reject('There is no category with this name!');
                    }
                });
        }),
    body('location')
        .trim()
        .custom((value, { req }) => {
            return Location.findById(value)
                .then(locationDoc => {
                    if (!locationDoc) {
                        return Promise.reject('There is no location with this name!');
                    }
                });
        })
        .withMessage('Please choose a valid location'),
]
const postUpdateValidator = [
    body('title')
        .trim()
        .isString()
        .isLength({ min: 10, max: 200 })
        .withMessage('Post title can must be between 10 - 300 alphanumeric characters'),
    body('introduction')
        .trim()
        .isString()
        .isLength({ min: 50, max: 500 })
        .withMessage('Post subtitle can must be between 40 - 500 alphanumeric characters'),
    body('body')
        .trim()
        .isString()
        .isLength({ min: 500 })
        .withMessage("Post body must be at least 400 alphanumeric characters"),
    body('type')
        .trim()
        .custom((value, { req }) => {
            return Type.findById(value)
                .then(typeDoc => {
                    if (!typeDoc) {
                        return Promise.reject('There is no type with this name!');
                    }
                });
        })
        .isString(),

    body('category')
        .trim()
        .custom((value, { req }) => {
            return Category.findById(value)
                .then(categoryDoc => {
                    if (!categoryDoc) {
                        return Promise.reject('There is no category with this name!');
                    }
                });
        }),
    body('location')
        .trim()
        .custom((value, { req }) => {
            return Location.findById(value)
                .then(locationDoc => {
                    if (!locationDoc) {
                        return Promise.reject('There is no location with this name!');
                    }
                });
        })
        .withMessage('Please choose a valid location'),
]

const router = express.Router();


router.post(
    '/posts',
    isAuth,
    imageUploadMiddleware,
    postValidator,
    postController.addNewPost
);

router.delete(
    '/posts/:postId',
    isAuth,
    postController.deletePost
);

router.patch(
    '/posts/:postId',
    isAuth,
    imageUploadMiddleware,
    postUpdateValidator,
    postController.editPost
);

router.get(
    '/posts/:type/:page/:size/:sort',
    // isAuth,
    postController.getAllPosts
);

router.get(
    '/posts/:postId',
    // isAuth,
    postController.getPostById
);

router.get(
    '/posts/search/',
    // isAuth,
    postController.searchPosts
);

module.exports = router;
