import express from 'express';
const router = express.Router();
import {getMessages, sendMessage, deleteMessage} from '../controllers/messageController.js';
import {protectUser} from '../middleware/authMiddleware.js';

router.route('/').post(protectUser, sendMessage);

router.route('/:id').delete(protectUser, deleteMessage);

router.route('/:username').get(protectUser, getMessages);


export default router;