const { validationResult } = require('express-validator');
const lodash = require('lodash');

const Post = require('../models/posts');
const Category = require('../models/category');
const Location = require('../models/location');
const Type = require('../models/type');
const User = require('../models/user');

const { onError, deleteFile } = require('../constants/global');

// Posts
exports.addNewPost = async (req, res, next) => {
    const { title, introduction, body, type, category, location } = req.body;
    // const postimg = req.files['postimage'][0];
    try {
        const postimg = req.files['postimage'][0];
        // Check validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (postimg) {
                deleteFile(postimg.path);
            }
            return onError('Validation failed', 422, errors, true, next);
        }
        //image
        if (!postimg) {
            return onError('You must provide a valid image file', 422, null, true, next);
        }
        // type
        const postType = await Type.findById(type);
        if (!postType) {
            return onError('You must provide a valid post type', 422, null, true, next);
        }

        const postCategory = await Category.findById(category);
        if (!postCategory) {
            return onError('You must provide a valid post category', 422, null, true, next);
        }

        const postLocation = await Location.findById(location);
        if (!postLocation) {
            return onError('You must provide a valid post location', 422, null, true, next);
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
        await post.remove();
        if (post.image) {
            deleteFile(post.image);
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
    const postimg = req.files['postimage'][0];
    try {
        // Check validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (postimg) {
                deleteFile(postimg.path)
            }
            return onError('Validation failed', 422, errors, true, next);
        }

        const oldPost = await Post.findById(postId);
        if (!oldPost) {
            if (postimg) {
                deleteFile(postimg.path)
            }
            return onError("No post found with this id!", 404, null, true, next);
        }

        //image
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
            message: "Edited post successfuly",
            data: savedPost,
            vlderror: false
        });
    } catch (error) {
        if (postimg) {
            deleteFile(postimg);
        }
        onError(error.toString(), 500, null, true, next);
    }
}
exports.getAllPosts = async (req, res, next) => {
    let { page, size, sort, type } = req.params;

    const typeObject = await Type.findById(type);
    if(!typeObject){
        return onError("Provide an existing type", 404, null, true, next);
    }
    size = +size <= 0 ? 10 : +size;
    page = +page <= 0 ? 1 : +page;
    sort = +sort <= 0 ? -1 : 1;
    const skip = (page - 1) * +size
    try {
        const posts = await Post.find({type})
            .populate('type')
            .populate('creator')
            .populate('category')
            .populate('location')
            .sort({ createdAt: sort })
            .skip(skip)
            .limit(size);
        const total = await Post.find().countDocuments();
        if (!posts) {
            posts = [];
        }
        res.status(200).json({
            message: "All posts fetched successfully!",
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
        const post = await Post.findById(postId)
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
