import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import ViewToken from '../models/viewTokenModel.js';

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.params.token) {
        try{
            token = req.params.token;
            const user = await User.findOne({api_token: token});
            if (!user) {
                res.status(401)
                throw new Error('Invalid token');
            }
            if (!user.verified) {
                res.status(401)
                throw new Error('Please verify your email');
            }
            req.user = user;
            next();
        } catch(error){
            console.log(error);
            res.status(401)
            throw new Error('Not authorized');
        }
    }
    else {
        res.status(401)
        throw new Error('Not authorized, no token provided');
    }
})

const protectUser = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try{
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch(error){
            console.log(error);
            res.status(401)
            throw new Error('Not authorized');
        }
    }
    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token provided');
    }
})

const verifyViewToken = asyncHandler(async (req, res, next) => {
    let token;
    if (req.body.token && req.body.username) {
        token = req.body.token;
        const user = await User.findOne({username: req.body.username});
        if (!user) {
            res.status(401)
            throw new Error('User not found');
        }
        const found_token = await ViewToken.findOne({token: token, user: user._id});
        if (!found_token) {
            res.status(401)
            throw new Error('Invalid token');
        }
        const today = new Date();
        const tokenDate = new Date(found_token.expires);
        if (today > tokenDate) {
            res.status(401)
            throw new Error('Token expired please eneter a new token');
        }
        next();
    } else {
        res.status(401)
        throw new Error('Not authorized, no token or username provided');
    }
});

const getUserSign = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try{
            token = req.headers.authorization.split(' ')[1];
            if (token === 'NoToken') {
                req.user = null;
                next();
            } else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
            }
        } catch(error){
            console.log(error);
            req.user = null;
            next();
        }
    }
    if (!token) {
        req.user = null;
        next();
    }
})


const admin_protected = asyncHandler(async (req, res, next) => {
    let token;

    if (req.params.token) {
        try{
            token = req.params.token;
            if (token !== process.env.ADMIN_TOKEN) {
                res.status(401)
                throw new Error('Invalid token');
            }
            next();
        } catch(error){
            console.log(error);
            res.status(401)
            throw new Error('Not authorized');
        }
    }
    else {
        res.status(401)
        throw new Error('Not authorized, no token provided');
    }
})

export {protect, protectUser, admin_protected, getUserSign, verifyViewToken};