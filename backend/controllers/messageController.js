import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Message from '../models/messageModel.js';

const populate_reciever = {path: 'reciever', select: ['-password', '-__v', '-createdAt', '-updatedAt', '-verified', '-reset_token']};

const populate_sender = {path: 'sender', select: ['-password', '-__v', '-createdAt', '-updatedAt', '-verified', '-reset_token']};

const getMessages = asyncHandler(async (req, res, next) => {
    const {username} = req.params;
    const query = req.query;
    const receiver = await User.findOne({username});
    const messages = await Message.find().or(
        [{sender: req.user._id, receiver: receiver._id}, {sender: receiver._id, receiver: req.user._id}]
        ).sort({createdAt: 1});
    res.status(200).json({
        success: true,
        messages: messages
    });
});

const getChats = asyncHandler(async (req, res, next) => {
    const chats = await Message.find({
        $or: [{sender: req.user._id}, {receiver: req.user._id}]
    }).populate(populate_sender).populate(populate_reciever).sort({createdAt: -1});
    const chats_sorted = [];
    const ids = []
    chats.forEach(chat => {
        if (chat.sender._id.toString() != req.user._id.toString()) {
            if (!ids.includes(chat.sender._id.toString())) {
                ids.push(chat.sender._id.toString());
                chats_sorted.push({
                    _id : chat._id,
                    text: chat.text,
                    createdAt: chat.createdAt,
                    recived: true,
                    user: chat.sender
                });
        }
    }
    if (chat.receiver._id.toString() != req.user._id.toString()) {
        if (!ids.includes(chat.receiver._id.toString())) {
            ids.push(chat.receiver._id.toString());
            chats_sorted.push({
                _id : chat._id,
                text: chat.text,
                createdAt: chat.createdAt,
                recived: false,
                user: chat.receiver
            });
        }
    }
    });

    res.status(200).json({
        success: true,
        chats: chats_sorted
    });
});

const deleteChat = asyncHandler(async (req, res, next) => {
    const {username} = req.params;
    const user = await User.findOne({username});
    const messages = await Message.find().or(
        [{sender: req.user._id, receiver: user._id}, {sender: user._id, receiver: req.user._id}]
    )
    messages.forEach(message => {
        message.remove();
    }
    );
    res.status(200).json({
        success: true,
        message: 'Chat deleted',
        username: user.username,
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

export {getMessages, sendMessage, deleteMessage, getChats, deleteChat};