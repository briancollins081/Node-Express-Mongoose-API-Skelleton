const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { onError, deleteFile, sendMail } = require('../constants/global');
const { privateKey, loginOptions } = require('../constants/JWTService');

const User = require('../models/user');

//Adding a new user
exports.userSignup = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        const profileimage = req.files['profilepic'][0];
        console.log({profileimage});
        const { firstname, lastname, email, phone, password } = req.body;
        // console.log(profileimage.path);
        if (!errors.isEmpty()) {
            deleteFile(profileimage.path);
            return onError('Validation failed', 200, errors, true, next);
        }

        const hpassword = await bcrypt.hash(password, 8);

        const user = new User({
            firstname: firstname,
            lastname: lastname,
            email: email,
            phone: phone,
            password: hpassword,
            profilepicture: `uploads/profiles/${profileimage.filename}`,
        });

        const userRes = await user.save();
        // send confirmation email
        // todo

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: userRes
        });
    } catch (error) {
        onError(error.message || "Error creating user", 500, null, true, next);
    }
}

exports.userSignin = async (req, res, next) => {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return onError('Validation errors', 400, errors, true, next);
    }
    // get the user
    try {
        const currentUser = await User.findOne({ email: email });
        if (!currentUser) {
            return onError("Your credentials are either wrong or not in our system", 401, null, true, next);
        }
        const passwordMatched = await bcrypt.compare(password, currentUser.password);
        if (!passwordMatched) {
            return onError("Your credentials are either wrong or not in our system", 401, null, true, next);
        }

        const token = jwt.sign(
            { userId: currentUser._id, email: currentUser.email },
            privateKey,
            loginOptions
        );

        res.status(200).json({
            message: "Login successfully",
            data: {
                token: token,
                id: currentUser._id
            },
            success: true
        })

    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}

exports.getUsers = async (req, res, next) => {

    let { page, size, sort } = req.params;
    // console.log({ page, size, sort });
    sort = !sort || +sort < 0 ? -1 : +sort > 0 ? 1 : -1;

    page = !page || +page < 1 ? 1 : +page;

    size = !size || +size < 1 ? 10 : +size;

    const skipSize = size * (page - 1);

    try {
        const users = await User.find().sort({ createdAt: sort }).skip(skipSize).limit(size);
        const totalRecords = await User.find().countDocuments();

        res.status(200);
        res.json({
            message: "Users fetched successfully !",
            users,
            page,
            fetchSize: users.length,
            size: size,
            totalRecords: totalRecords,
            success: true
        })
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}

exports.getUser = async (req, res, next) => {
    const userToFindId = req.params.id;
    try {
        const user = await User.findById(userToFindId);
        if (!user) {
            return onError("User not found", 404, null, true, next);
        }
        res.status(200).json({
            message: "Fetched user successfuly",
            data: user,
            success: true
        })
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}

exports.updateUser = async (req, res, next) => {
    if (req.userId.toString() !== req.params.id.toString()) {
        return onError("You can only update your own profile!", 403, null, true, next);
    }
    const reqFiles = req.files['profilepic'];
    const profileimage = reqFiles[0];
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return onError('Validation errors', 400, errors, true, next);
        }

        const userId = req.params.id;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const email = req.body.email;
        const phone = req.body.phone;
        let profilepicture = profileimage ? profileimage.path : null;

        const password = req.body.password;

        let hpassword;
        if (password.length >= 8) {
            hpassword = await bcrypt.hash(password, 8);
        }

        const user = await User.findById(userId);

        if (!user) {
            deleteFile(profileimage.path);
            return onError("User with this ID does not exist", 404, null, true, next);
        }
        if (user.profilepicture !== profilepicture && profilepicture !== null) {
            user.profilepicture = profilepicture;
            deleteFile(user.profilepicture);
        }
        user.firstname = firstname;
        user.lastname = lastname;
        user.email = email;
        user.phone = phone;
        user.password = hpassword ? hpassword : user.password;


        const updatedUser = await user.save();

        res.status(201).json({
            message: "User updated successfully",
            data: updatedUser,
            success: true
        })

    } catch (error) {
        deleteFile(profileimage.path);
        onError(error.toString(), 500, null, true, next);
    }
}

exports.deleteUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (user) {
            await user.remove();
        }
        res.status(201)
        res.json({
            message: "Deleted user successfully!",
            success: true
        })
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    }
}

/* exports.dispatchEmail = async (req, res, next) => {
    console.log("email request came");
    let user = req.body;
    console.log({user});
    sendMail(user, (err, info) => {
        if (err) {
            console.log(err);
            res.status(400);
            res.json({ success: false, error: "Email not sent" });
        } else {
            console.log("Email sent");
            res.status(200);
            res.json({ success: true, data: info });
        }
    });
} */
