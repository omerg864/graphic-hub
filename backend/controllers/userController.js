import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import sendEmail from '../middleWare/emailMiddleware.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';

const savedUsernames = ["login", "register", "verify", "chat", "chats", "settings", "search", "NewProject", "admin", "api" ];

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

const registerUser = asyncHandler(async (req, res, next) => {
    const {f_name, l_name, username, email, password, company} = req.body;
    const userExists = await User.findOne({ "email" : { $regex : new RegExp(email, "i") } });
    if (userExists) {
        res.status(400)
        throw new Error('User with that email already exists');
    }
    var username1 = username.toLowerCase().replace(' ', '');
    if (savedUsernames.includes(username1) || await User.findOne({ username: username1 })) {
        res.status(400);
        throw new Error('Username is already taken');
    } 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
        f_name: f_name,
        l_name: l_name,
        username: username,
        email: email,
        password: hashedPassword,
        company: company,
        verified: false,
        intro: ""
    });
    sendEmail(user.email, 'Verify your email', `Please verify your email by clicking on the link: ${process.env.HOST_ADDRESS}/verify/${user._id}`);
    res.status(201).json({
        success: true,
        user: {
            f_name: user.f_name,
            l_name: user.l_name,
            email: user.email,
            company: user.company,
            verified: user.verified
        },
        message: 'User created successfully and verification email sent'
    });
});


const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    var user = await User.findOne({ email });
    if (!user) {
        res.status(400)
        throw new Error('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400)
        throw new Error('Invalid email or password');
    }
    if (!user.verified) {
        res.status(400)
        throw new Error('Please verify your email');
    }
    const token = generateToken(user._id);
    delete user._doc["password"]
    delete user._doc["reset_token"]
    delete user._doc["createdAt"]
    delete user._doc["updatedAt"]
    delete user._doc["__v"]
    res.status(200).json({
        success: true,
        user: {
            ...user._doc,
            token: token
        }
    });
});

const getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({username: req.params.username}).select('-password', "-reset_token", "-__v", "createdAt", "updatedAt");
    if (!user) {
        res.status(400)
        throw new Error('User does not exist');
    }
    res.status(200).json({
        success: true,
        user: user
    });
});

const verifyUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(400)
        throw new Error('Invalid url');
    }
    if (user.verified) {
        res.status(400)
        throw new Error('User already verified');
    }
    user.verified = true;
    await user.save();
    res.status(200).json({
        success: true,
        message: 'User verified successfully'
    });
});

const updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(400)
        throw new Error('User does not exist');
    }
    const {f_name, l_name, username, email, company, img_url, intro, deleteImage} = req.body;
    const username1 = username.toLowerCase().replace(' ', '');
    if (username1 !== user.username.toLowerCase().replace(' ', '')) {
    if (savedUsernames.includes(username1) || await User.findOne({ username: username1 })) {
        res.status(400);
        throw new Error('Username is already taken');
    }
    }
    if (email !== user.email) {
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400)
            throw new Error('User with that email already exists');
        }
    }
    if (deleteImage) {
        var public_id = "graphic hub/" + deleteImage.split('/').pop().split('.')[0];
        try {
            cloudinary.uploader.destroy(public_id, {
                cloud_name: process.env.CLOUD_NAME, 
                api_key: process.env.CLOUDINARY_API_KEY, 
                api_secret: process.env.CLOUDINARY_API_SECRET,
                secure: true,
                invalidate: true,
                resource_type: 'image'
            }, function(error,result) {
                console.log(result, error) }
            );
        }
        catch (err) {
            console.log(err);
        }
    }
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        f_name: f_name,
        l_name: l_name,
        username: username,
        email: email,
        company: company,
        img_url: img_url,
        intro: intro
    }, { new: true });
    res.status(200).json({
        success: true,
        user: updatedUser
    });
});

const updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(400)
        throw new Error('User does not exist');
    }
    const { oldPassword, password } = req.body;
    if (!oldPassword || !password) {
        res.status(400)
        throw new Error('Please provide old and new password');
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        res.status(400)
        throw new Error('Invalid password');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
        password: hashedPassword
    }, { new: true });
    res.status(200).json({
        success: true
    });
});

const createResetPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ "email" : { $regex : new RegExp(`^${req.body.email}$`, 'i') } });
    if (!user) {
        res.status(400)
        throw new Error('Email not found');
    }
    var generatedToken = crypto.randomBytes(26).toString('hex');
    while (await User.findOne({reset_token: generatedToken})) {
        generatedToken = crypto.randomBytes(26).toString('hex');
    }
    user.reset_token = generatedToken;
    await user.save();
    sendEmail(user.email, 'Reset your password', `Please click on the link to reset your password: ${process.env.HOST_ADDRESS}/resetPassword/${user.reset_token}`);
    res.status(200).json({
        success: true,
        message: 'Reset password email sent'
    });
});

const resetPassword = asyncHandler(async (req, res, next) => {
    if (!req.body.password) {
        res.status(400)
        throw new Error('Password is required');
    }
    if (!req.params.token) {
        res.status(400)
        throw new Error('Reset token is required');
    }
    const user = await User.findOne({ reset_token: req.params.token });
    if (!user) {
        res.status(400)
        throw new Error('Reset Token expired or invalid, please send a new reset email');
    }
    const { password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const updatedUser = await User.findOneAndUpdate({ reset_token: req.params.token }, {
        password: hashedPassword,
        reset_token: null
    }, { new: true });
    res.status(200).json({
        success: true,
        message: 'Password updated successfully'
    });
});

const updateFollow = asyncHandler(async (req, res, next) => {
    const {username} = req.params;
    const user = await User.findOne({username: username});
    if (!user) {
        res.status(404)
        throw new Error('User not found');
    }
    if (user.followers.includes(req.user.username)) {
        const updatedUser = await User.findByIdAndUpdate(user._id, {
            $pull: {
                followers: req.user.username
            }
        }, {new: true}).select('-password', "-reset_token", "-__v", "createdAt", "updatedAt");
        const me = await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                following: user.username
            }
        }, {new: true}).select('-password', "-reset_token", "-__v", "createdAt", "updatedAt");
        res.status(200).json({
            success: true,
            friend: updatedUser,
            user: me
        });
    } else {
        const updatedUser = await User.findByIdAndUpdate(user._id, {
            $push: {
                followers: req.user.username
            }
        }, {new: true}).select('-password', "-reset_token", "-__v", "createdAt", "updatedAt");
        const me = await User.findByIdAndUpdate(req.user._id, {
            $push: {
                following: user.username
            }
        }, {new: true}).select('-password', "-reset_token", "-__v", "createdAt", "updatedAt");
        res.status(200).json({
            success: true,
            friend: updatedUser,
            user: me
        });
    }
});

const searchUser = asyncHandler(async (req, res, next) => {
    const {username} = req.params;
    const users = await User.find({ $or :
        [
            {username: {$regex: username, $options: 'i'}},
            {f_name: {$regex: username, $options: 'i'}},
            {l_name: {$regex: username, $options: 'i'}},
            {intro: {$regex: username, $options: 'i'}},
            {company: {$regex: username, $options: 'i'}},
            {email: {$regex: username, $options: 'i'}}

        ]
    }).select('-password', "-reset_token", "-__v", "createdAt", "updatedAt");
    res.status(200).json({
        success: true,
        users: users
    });
});

const getUserByid = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-password', "-reset_token", "-__v", "createdAt", "updatedAt");
    if (!user) {
        res.status(400)
        throw new Error('User does not exist');
    }
    res.status(200).json({
        success: true,
        user: user
    });
});


export {registerUser, loginUser, getUser, verifyUser, updateFollow, searchUser, getUserByid, updateUser, updatePassword, createResetPassword, resetPassword};