import express from 'express';
const router = express.Router();
import {getTokens, addToken, updateToken, deleteToken, VerifyToken} from '../controllers/viewTokenController.js';
import {protectUser} from '../middleware/authMiddleware.js';

router.route('/').get(protectUser, getTokens).post(protectUser, addToken);

router.route('/:id').put(protectUser, updateToken).delete(protectUser, deleteToken);

router.route('/:token').get(protectUser, VerifyToken);


export default router;