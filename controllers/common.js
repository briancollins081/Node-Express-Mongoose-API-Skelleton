const { validationResult } = require('express-validator');

const Post = require('../models/posts');
const Category = require('../models/category');
const Location = require('../models/location');
const Type = require('../models/type');
const User = require('../models/user');
const Gallery = require('../models/gallery');

const { onError, deleteFile } = require('../constants/global');

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
        const oldLocation = await Location.findById(id);
        if (!oldLocation) {
            return onError('Location with this id does not exist', 404, null, true, next);
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
exports.deleteLocation = async (req, res, next) => {
    const { id } = req.params;
    try {
        const location = await Location.findOne({_id: id});
        if(location){
            await location.remove();
        }
        res.status(201);
        res.json({
            message: "Deleted location succesfully",
            success: true
        })
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}
exports.getAllLocations = async (req, res, next) => {
    let { page, size, sort } = req.params;
    size = +size <= 0 ? 10 : +size;
    page = +page <= 0 ? 1 : +page;
    sort = +sort <= -1 ? -1 : 1;
    const skip = (page - 1) * +size
    try {
        const locations = await Location.find()
            .skip(skip)
            .limit(size)
            .sort({ createdAt: sort });
        const total = await Location.find().countDocuments();
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
        const savedCategory = await category.save();

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
        const oldCategory = await Category.findById(id);
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
            message: "Category updated successful",
            data: updatedCategory,
            success: true,
            vlderror: false
        });
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}
exports.deleteCategory = async (req, res, next) => {
    const { id } = req.params;
    try {
        const category = await Category.findOne({
            _id: id
        });
        if(category){
            await category.remove();
        }
        res.status(201);
        res.json({
            message: "Deleted category succesfully",
            success: true
        })
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
        const oldType = await Type.findById(id);
        if (!oldType) {
            return onError('Type with this id does not exist', 404, null, true, next);
        }
        // Check validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return onError('Validation failed', 422, errors, true, next);
        }

        oldType.title = title;

        const updatedType = await oldType.save();

        res.status(201).json({
            message: "Type created successful",
            data: updatedType,
            success: true,
            vlderror: false
        });
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}
exports.deleteType = async (req, res, next) => {
    const { id } = req.params;
    try {
        const type = await Type.findOneAndRemove({ _id: id });
        if(type){
            await type.remove();
        }
        res.status(201);
        res.json({
            message: "Deleted category succesfully",
            success: true
        })
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

// Gallery
exports.addNewGallery = async (req, res, next) => {
    const { title } = req.body;
    try {
        const galleryimg = req.files['gallerypic'][0];
        if(!galleryimg){
            return onError('Please supply a .jpg, .jpeg, .png image file', 422, null, true, next);
        }

        // Check validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return onError('Validation failed', 422, errors, true, next);
        }

        const gallery = new Gallery({
            title: title,
            image: galleryimg.path
        });
        const savedGallery = await gallery.save();

        res.status(201).json({
            message: "Gallery added successful",
            data: savedGallery,
            success: true,
            vlderror: false
        });
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}
exports.editGallery = async (req, res, next) => {
    const { id } = req.params;
    const { title } = req.body;
    try {
        const galleryimg = req.files['gallerypic'][0];
        const oldGallery = await Gallery.findById(id);
        if (!oldGallery) {
            return onError('Gallery with this id does not exist', 404, null, true, next);
        }
        if(galleryimg){
          deleteFile(oldGallery.image);
        }
        // Check validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return onError('Validation failed', 422, errors, true, next);
        }

        oldGallery.title = title;
        oldGallery.image = galleryimg.path;

        const updatedGallery = await oldGallery.save();

        res.status(201).json({
            message: "Type created successful",
            data: updatedGallery,
            success: true,
            vlderror: false
        });
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}
exports.deleteGallery = async (req, res, next) => {
    const { id } = req.params;
    try {
        const type = await Gallery.findById(id);
        if(type){
            const deleteCount = await type.remove();
            if(deleteCount && deleteCount > 0){
              deleteFile(type.image);
            }
        }
        res.status(201);
        res.json({
            message: "Deleted gallery entry succesfully",
            success: true
        })
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}
exports.getAllGalleries = async (req, res, next) => {
    let { page, size } = req.params;
    size = +size <= 0 ? 10 : +size;
    page = +page <= 0 ? 1 : +page;
    const skip = (page - 1) * +size
    try {
        const galleries = await Gallery.find()
            .skip(skip)
            .limit(size);
        const total = await Gallery.find().countDocuments();
        if (!galleries) {
            galleries = [];
        }
        res.status(200).json({
            message: "All galleries fetched successfully!",
            data: {
                galleries,
                page,
                fetchSize: galleries.length,
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
exports.getGalleryById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const gallery = await Gallery.findById(id);

        if (!gallery) {
            return onError("No gallery found with this id", 404, null, true, next);
        }
        res.status(200).json({
            message: "Gallery fetched successfully!",
            data: gallery,
            success: true,
            vlderror: false
        })
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}
