const express = require('express');
const { body } = require('express-validator');

const commonController = require('../controllers/common');
const { isAuth } = require('../middlewares/auth');
const { galleryUploadMiddleware } = require('../middlewares/fileUpload');


const Post = require('../models/posts');
const Category = require('../models/category');
const Location = require('../models/location');
const Type = require('../models/type');
const User = require('../models/user');
const Gallery = require('../models/gallery');

const router = express.Router();

// Location
router.post(
    '/location',
    isAuth,
    [
        body('title')
            .trim()
            .custom((value, { req }) => {
                const query = { 'title': new RegExp(`^${value}$`, 'i') };
                return Location.findOne(query)
                    .then(categoryDoc => {
                        if (categoryDoc) {
                            return Promise.reject('There is a location with this name!');
                        }
                    });
            }),
        body('abbreviation')
            .trim()
            .custom((value, { req }) => {
                const query = { 'abbreviation': new RegExp(`^'${value}'$`, 'i') };
                return Location.findOne(query)
                    .then(categoryDoc => {
                        if (categoryDoc) {
                            return Promise.reject('There is an abbreviation with this name!');
                        }
                    });
            }),
    ],
    commonController.addNewLocation
);
router.delete(
    '/location/:id',
    isAuth,
    commonController.deleteLocation
);
router.patch(
    '/location/:id',
    isAuth,
    [
        body('title')
            .trim()
            .notEmpty()
            .withMessage("Location title can not be empty!"),
        body('abbreviation')
            .trim()
            .notEmpty()
            .withMessage("Location abbreviation can not be empty!"),
    ],
    commonController.editLocation
);
router.get(
    '/location/:page/:size/:sort',
    // isAuth,
    commonController.getAllLocations
);

// Categories
router.post(
    '/categories',
    isAuth,
    [
        body('title')
            .trim()
            .custom((value, { req }) => {
                const query = { 'title': new RegExp(`^${value}$`, 'i') };
                return Category.findOne(query)
                    .then(categoryDoc => {
                        if (categoryDoc) {
                            return Promise.reject('There is a location with this name!');
                        }
                    });
            }),
    ],
    commonController.addNewCategory
);
router.delete(
    '/categories/:id',
    isAuth,
    commonController.deleteCategory
);
router.patch(
    '/categories/:id',
    isAuth,
    [
        body('title')
            .trim()
            .notEmpty()
            .withMessage("Location title can not be empty!"),
    ],
    commonController.editCategory
);
router.get(
    '/categories/:page/:size/:sort',
    // isAuth,
    commonController.getAllCategories
);

// Type
router.post(
    '/type',
    isAuth,
    [
        body('title')
            .trim()
            .custom((value, { req }) => {
                const query = { 'title': new RegExp(`^${value}$`, 'i') };
                return Type.findOne(query)
                    .then(type => {
                        if (type) {
                            return Promise.reject('There is a location with this name!');
                        }
                    });
            }),
    ],
    commonController.addNewType
);
router.delete(
    '/type/:id',
    isAuth,
    commonController.deleteType
);
router.patch(
    '/type/:id',
    isAuth,
    [
        body('title')
            .trim()
            .notEmpty()
            .withMessage("Location title can not be empty!"),
    ],
    commonController.editType
);
router.get(
    '/type/:page/:size/:sort',
    // isAuth,
    commonController.getAllTypes
);


// Gallery
router.post(
    '/gallery',
    isAuth,
    galleryUploadMiddleware,
    [
        body('title')
            .trim()
            .custom((value, { req }) => {
                const query = { 'title': new RegExp(`^${value}$`, 'i') };
                return Gallery.findOne(query)
                    .then(type => {
                        if (type) {
                            return Promise.reject('There is an image with this title/description!');
                        }
                    });
            }),
    ],
    commonController.addNewGallery
);
router.delete(
    '/gallery/:id',
    isAuth,
    commonController.deleteGallery
);
router.patch(
    '/gallery/:id',
    isAuth,
    galleryUploadMiddleware,
    [
        body('title')
            .trim()
            .notEmpty()
            .withMessage("Gallery title can not be empty!"),
    ],
    commonController.editGallery
);
router.get(
    '/gallery/:page/:size/:sort',
    // isAuth,
    commonController.getAllGalleries
);

module.exports = router;
