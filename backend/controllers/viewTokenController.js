import asyncHandler from 'express-async-handler';
import ViewToken from '../models/viewTokenModel.js';
import crypto from 'crypto';


const getTokens = asyncHandler(async (req, res, next) => {
    const tokens = await ViewToken.find({user: req.user._id});
    res.status(200).json({
        success: true,
        tokens: tokens
    });
});

const addToken = asyncHandler(async (req, res, next) => {
    const {name, expires} = req.body;
    var generatedToken = crypto.randomBytes(32).toString('hex');
    while (await ViewToken.findOne({token: generatedToken})) {
        generatedToken = crypto.randomBytes(32).toString('hex');
    }
    const token = await ViewToken.create({
        name: name,
        token: generatedToken,
        expires: expires,
        user: req.user
    });
    res.status(200).json({
        success: true,
        token: token
    });
});


const updateToken = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const {name, expires} = req.body;
    const token = await ViewToken.findById(id);
    if (!token) {
        res.status(404)
        throw new Error(`Token with id ${id} not found`);
    }
    if (token.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error(`You are not authorized to update this token`);
    }
    var updatedToken = await ViewToken.findByIdAndUpdate(id, {
        name: name,
        expires: expires
    }, {new: true});
    res.status(200).json({
        success: true,
        token: updatedToken
    });
});


const deleteToken = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const token = await ViewToken.findById(id);
    if (!token) {
        res.status(404)
        throw new Error(`Token with id ${id} not found`);
    }
    if (token.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error(`You are not authorized to delete this token`);
    }
    await ViewToken.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        id : id
    });
});

const VerifyToken = asyncHandler(async (req, res, next) => {
    const {token} = req.params;
    const tokenExists = await ViewToken.findOne({token: token});
    if (!tokenExists) {
        res.status(404)
        throw new Error(`Token with token ${token} not found`);
    }
    if (tokenExists.expires < Date.now()) {
        res.status(401)
        throw new Error(`Token with token ${token} has expired`);
    }
    res.status(200).json({
        success: true,
        token: tokenExists
    });
});


export {getTokens, addToken, updateToken, deleteToken, VerifyToken};