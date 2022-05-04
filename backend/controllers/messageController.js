import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Message from '../models/messageModel.js';

const getMessages = asyncHandler(async (req, res, next) => {
    const {username} = req.params;
    const receiver = await User.findOne({username});
    const messages = await Message.find().or([{sender: req.user._id, receiver: receiver._id}, {sender: receiver._id, receiver: req.user._id}]).sort({createdAt: 1});
    res.status(200).json({
        success: true,
        messages: messages
    });
});

const sendMessage = asyncHandler(async (req, res, next) => {
    const {username, message} = req.body;
    const receiver = await User.findOne({username: username});
    if (!receiver) {
        res.status(404)
        throw new Error(`User ${username} not found`);
    }
    const message_obj = {
        sender: req.user._id,
        receiver: receiver._id,
        text: message
    };
    const new_message = await Message.create(message_obj);
    res.status(200).json({
        success: true,
        message: new_message
    });
});

const deleteMessage = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const message = await Message.findById(id);
    if (!message) {
        res.status(404)
        throw new Error(`Message with id ${id} not found`);
    }
    if (message.sender.toString() !== req.user._id.toString()) {
        res.status(401)
        throw new Error(`You are not authorized to delete this message`);
    }
    await Message.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: `Message with id ${id} deleted`,
        id: id,
    });
});

export {getMessages, sendMessage, deleteMessage};