import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

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

export {protect, protectUser, admin_protected};