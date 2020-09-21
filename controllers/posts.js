const { validationResult } = require('express-validator');
const lodash = require('lodash');

const Post = require('../models/posts');
const Category = require('../models/category');
const Location = require('../models/location');
const Type = require('../models/type');
const User = require('../models/user');

const { onError, deleteFile } = require('../constants/global');
const { times } = require('lodash');
const type = require('../models/type');

// Posts
exports.addNewPost = async (req, res, next) => {
    const { title, introduction, body, type, category, location } = req.body;
    try {
        // Check validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (postimg) {
                deleteFile(postimg.path);
            }
            return onError('Validation failed', 422, errors, true, next);
        }
        //image
        const postimg = req.files['postimage'][0];
        if (!postimg) {
            return onError('You must provide a valid image file', 422, errors, true, next);
        }
        // type
        const postType = await Type.findById(type);
        if (!postType) {
            return onError('You must provide a valid post type', 422, errors, true, next);
        }

        const postCategory = await Category.findById(category);
        if (!postCategory) {
            return onError('You must provide a valid post category', 422, errors, true, next);
        }

        const postLocation = await Location.findById(location);
        if (!postLocation) {
            return onError('You must provide a valid post location', 422, errors, true, next);
        }

        const post = new Post({
            title: title,
            introduction: introduction,
            body: body,
            image: postimg.path,
            type: type,
            creator: req.userId,
            category: category,
            location: location
        });
        const savedPost = await post.save();
        res.status(201).json({
            message: "Post created successful",
            data: savedPost,
            success: true,
            vlderror: false
        });
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}
exports.deletePost = async (req, res, next) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById({ _id: postId });
        if (!post) {
            return onError("No post found with this ID!", 404, null, true, next);
        }
        if (post.creator.toString() !== req.userId.toString()) {
            return onError("You are not authorized to delete this post!", 403, null, true, next);
        }
        res.status(201).json({
            message: "Deleted post successful",
            data: post,
            success: true,
            vlderror: false
        });

    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}
exports.editPost = async (req, res, next) => {
    const { postId } = req.params;
    const { title, introduction, body, type, category, location } = req.body;
    try {
        // Check validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return onError('Validation failed', 422, errors, true, next);
        }

        const oldPost = await Post.findById(postId);
        if (!oldPost) {
            return onError("No post found with this id!", 404, null, true, next);
        }

        //image
        const postimg = req.files['postimage'][0];
        if (postimg) {
            deleteFile(oldPost.image);
            oldPost.image = postimg.path;
        }

        // type
        const postType = await Type.findById(type);
        if (!postType) {
            return onError('You must provide a valid post type', 422, errors, true, next);
        }

        const postCategory = await Category.findById(category);
        if (!postCategory) {
            return onError('You must provide a valid post category', 422, errors, true, next);
        }

        const postLocation = await Location.findById(location);
        if (!postLocation) {
            return onError('You must provide a valid post location', 422, errors, true, next);
        }

        oldPost.title = title;
        oldPost.introduction = introduction;
        oldPost.body = body;
        oldPost.type = type;
        oldPost.category = category;
        oldPost.location = location;

        const savedPost = await oldPost.save();
        res.status(200).json({
            message: "Edited tag successfuly",
            data: savedPost,
            vlderror: false
        });
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}
exports.getAllPosts = async (req, res, next) => {
    let { page, size } = req.params;
    size = +size <= 0 ? 10 : +size;
    page = +page <= 0 ? 1 : +page;
    const skip = (page - 1) * +size
    try {
        const posts = await Post.find()
            .populate('type')
            .populate('creator')
            .populate('category')
            .populate('location')
            .skip(skip)
            .limit(size);
        const total = await Post.find().countDocuments();
        if (!posts) {
            posts = [];
        }
        res.status(200).json({
            message: "All tags fetched successfully!",
            data: {
                posts,
                page,
                fetchSize: posts.length,
                pageSize: size,
                totalRecords: total
            },
            success: true,
            vlderror: false
        })
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}
exports.getPostById = async (req, res, next) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(id)
            .populate('type')
            .populate('creator')
            .populate('category')
            .populate('location');
        if (!post) {
            return onError("No post found with this id", 404, null, true, next);
        }
        res.status(200).json({
            message: "Post fetched successfully!",
            data: post,
            success: true,
            vlderror: false
        })
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}
exports.searchPosts = async (req, res, next) => {
    let { key, category } = req.query;
    if (!category) {
        category = 'posts';
    }
    if (!key) {
        key = '';
    }
    const regexQuery = {
        title: new RegExp(key, 'i'),
        introduction: new RegExp(key, 'i'),
        body: new RegExp(key, 'i'),
        type: new RegExp(key, 'i')
    };
    let matchedPosts = await Post.find(regexQuery);
    if (!matchedPosts) {
        matchedPosts = [];
    }
    res.status(200);
    res.json({
        message: "Search applied successful",
        data: matchedPosts,
        success: true,
        vlderror: false
    })
}

// Locations
exports.addNewLocation = async (req, res, next) => {
    const { title, abbreviation } = req.body;
    try {
        // Check validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return onError('Validation failed', 422, errors, true, next);
        }

        const location = new Location({
            title: title,
            abbreviation: abbreviation
        });
        const savedLocation = await location.save();

        res.status(201).json({
            message: "Location created successful",
            data: savedLocation,
            success: true,
            vlderror: false
        });
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}
exports.editLocation = async (req, res, next) => {
    const { id } = req.params;
    const { title, abbreviation } = req.body;
    try {
        const oldLocation = Location.findById(id);
        if (!oldLocation) {
            return onError('Location with this id does not exist', 404, errors, true, next);
        }
        // Check validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return onError('Validation failed', 422, errors, true, next);
        }

        oldLocation.title = title;
        oldLocation.abbreviation = abbreviation;

        const savedLocation = await oldLocation.save();

        res.status(201).json({
            message: "Location created successful",
            data: savedLocation,
            success: true,
            vlderror: false
        });
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}
exports.getAllLocations = async (req, res, next) => {
    let { page, size } = req.params;
    size = +size <= 0 ? 10 : +size;
    page = +page <= 0 ? 1 : +page;
    const skip = (page - 1) * +size
    try {
        const locations = await Location.find()
            .skip(skip)
            .limit(size);
        const total = await Post.find().countDocuments();
        if (!locations) {
            locations = [];
        }
        res.status(200).json({
            message: "All locations fetched successfully!",
            data: {
                locations,
                page,
                fetchSize: locations.length,
                pageSize: size,
                totalRecords: total
            },
            success: true,
            vlderror: false
        })
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}
exports.getLocationById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const location = await Location.findById(id);

        if (!location) {
            return onError("No post found with this id", 404, null, true, next);
        }
        res.status(200).json({
            message: "Location fetched successfully!",
            data: location,
            success: true,
            vlderror: false
        })
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}

// Categories
exports.addNewCategory = async (req, res, next) => {
    const { title } = req.body;
    try {
        // Check validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return onError('Validation failed', 422, errors, true, next);
        }

        const category = new Category({
            title: title
        });
        const savedType = await category.save();

        res.status(201).json({
            message: "Category created successful",
            data: savedCategory,
            success: true,
            vlderror: false
        });
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}
exports.editCategory = async (req, res, next) => {
    const { id } = req.params;
    const { title } = req.body;
    try {
        const oldCategory = Category.findById(id);
        if (!oldCategory) {
            return onError('Category with this id does not exist', 404, errors, true, next);
        }
        // Check validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return onError('Validation failed', 422, errors, true, next);
        }

        oldCategory.title = title;

        const updatedCategory = await oldCategory.save();

        res.status(201).json({
            message: "Category created successful",
            data: updatedCategory,
            success: true,
            vlderror: false
        });
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}
exports.getAllCategories = async (req, res, next) => {
    let { page, size } = req.params;
    size = +size <= 0 ? 10 : +size;
    page = +page <= 0 ? 1 : +page;
    const skip = (page - 1) * +size
    try {
        const categories = await Category.find()
            .skip(skip)
            .limit(size);
        const total = await Category.find().countDocuments();
        if (!categories) {
            categories = [];
        }
        res.status(200).json({
            message: "All categories fetched successfully!",
            data: {
                categories,
                page,
                fetchSize: categories.length,
                pageSize: size,
                totalRecords: total
            },
            success: true,
            vlderror: false
        })
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}
exports.getCategoryById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const category = await Location.findById(id);

        if (!category) {
            return onError("No category found with this id", 404, null, true, next);
        }
        res.status(200).json({
            message: "Category fetched successfully!",
            data: category,
            success: true,
            vlderror: false
        })
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}

// Types
exports.addNewType = async (req, res, next) => {
    const { title } = req.body;
    try {
        // Check validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return onError('Validation failed', 422, errors, true, next);
        }

        const type = new Type({
            title: title
        });
        const savedType = await type.save();

        res.status(201).json({
            message: "Type created successful",
            data: savedType,
            success: true,
            vlderror: false
        });
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}
exports.editType = async (req, res, next) => {
    const { id } = req.params;
    const { title } = req.body;
    try {
        const oldType = Type.findById(id);
        if (!oldType) {
            return onError('Type with this id does not exist', 404, errors, true, next);
        }
        // Check validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return onError('Validation failed', 422, errors, true, next);
        }

        oldCategory.title = title;

        const updatedCategory = await oldCategory.save();

        res.status(201).json({
            message: "Type created successful",
            data: updatedCategory,
            success: true,
            vlderror: false
        });
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}
exports.getAllTypes = async (req, res, next) => {
    let { page, size } = req.params;
    size = +size <= 0 ? 10 : +size;
    page = +page <= 0 ? 1 : +page;
    const skip = (page - 1) * +size
    try {
        const types = await Type.find()
            .skip(skip)
            .limit(size);
        const total = await Type.find().countDocuments();
        if (!types) {
            types = [];
        }
        res.status(200).json({
            message: "All types fetched successfully!",
            data: {
                types,
                page,
                fetchSize: types.length,
                pageSize: size,
                totalRecords: total
            },
            success: true,
            vlderror: false
        })
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}
exports.getTypeById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const type = await Type.findById(id);

        if (!type) {
            return onError("No type found with this id", 404, null, true, next);
        }
        res.status(200).json({
            message: "Type fetched successfully!",
            data: type,
            success: true,
            vlderror: false
        })
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}