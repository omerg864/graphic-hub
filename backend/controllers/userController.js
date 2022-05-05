import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import sendEmail from '../middleWare/emailMiddleware.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

const registerUser = asyncHandler(async (req, res, next) => {
    const {f_name, l_name, username, email, password, company} = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400)
        throw new Error('User already exists');
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
        verified: false
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
    const user = await User.findOne({ email });
    if (!user) {
        res.status(400)
        throw new Error('User does not exist');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400)
        throw new Error('Invalid credentials');
    }
    if (!user.verified) {
        res.status(400)
        throw new Error('Please verify your email');
    }
    const token = generateToken(user._id);
    res.status(200).json({
        success: true,
        user: {
            ...user._doc,
            token: token
        }
    });
});

const getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({username: req.params.username}).select('-password');
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
        }, {new: true}).select('-password');
        const me = await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                following: user.username
            }
        }, {new: true}).select('-password');
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
        }, {new: true}).select('-password');
        const me = await User.findByIdAndUpdate(req.user._id, {
            $push: {
                following: user.username
            }
        }, {new: true}).select('-password');
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
    }).select('-password');
    res.status(200).json({
        success: true,
        users: users
    });
});

const getUserByid = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
        res.status(400)
        throw new Error('User does not exist');
    }
    res.status(200).json({
        success: true,
        user: user
    });
});


export {registerUser, loginUser, getUser, verifyUser, updateFollow, searchUser, getUserByid};