const express = require('express');
const { body } = require('express-validator');


const User = require('../models/user');
const authController = require('../controllers/auth');
const { isAuth } = require('../middlewares/auth');
const { imageUploadMiddleware } = require('../middlewares/fileUpload');

const router = express.Router();

router.post(
    '/signup',
    imageUploadMiddleware,
    [
        body('firstname')
            .trim()
            .notEmpty(),
        body('lastname')
            .trim()
            .notEmpty(),
        body('email')
            .trim()
            .isEmail()
            .withMessage('Please enter a valid email address')
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('Email address is already taken');
                        }
                    });
            })
            .normalizeEmail(),
        body('phone')
            .trim()
            .custom((value, { req }) => {
                return User.findOne({ phone: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('Phone number is already used')
                        }
                    })
            }),
        body('password')
            .trim()
            .isLength({ min: 8 })
            .withMessage("Invaid password. It must be atleast 8 alphanumeric characters")
    ],
    authController.userSignup
);

router.post(
    '/signin',
    [
        body('email')
            .trim()
            .isEmail()
            .withMessage('Please enter a valid email address')
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 8 })
            .withMessage("Invaid password. Expected at least 8 alphanumeric characters")
    ],
    authController.userSignin
);

router.get(
    'users/:page/:size/:sort',
    isAuth,
    authController.getUsers
);

router.get(
    'users/:id',
    isAuth,
    authController.getUser
);

router.patch(
    'users/update/:id',
    isAuth,
    imageUploadMiddleware,
    [
        body('firstname')
            .trim()
            .notEmpty(),
        body('lastname')
            .trim()
            .notEmpty(),
        body('email')
            .trim()
            .isEmail()
            .withMessage('Please enter a valid email address')
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('Email address is already taken');
                        }
                    });
            })
            .normalizeEmail(),
        body('phone')
            .trim()
            .custom((value, { req }) => {
                return User.findOne({ phone: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('Phone number is already used')
                        }
                    })
            }),
        body('password')
            .trim()
            .isLength({ min: 8 })
            .withMessage("Invaid password. It must be atleast 8 alphanumeric characters")
    ],
    authController.updateUser
);


module.exports = router;