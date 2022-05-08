import express from 'express';
const router = express.Router();
import {getTokens, addToken, updateToken, deleteToken, VerifyToken, getToken} from '../controllers/viewTokenController.js';
import {protectUser} from '../middleware/authMiddleware.js';

router.route('/').get(protectUser, getTokens).post(protectUser, addToken);

router.route('/:id').put(protectUser, updateToken).delete(protectUser, deleteToken).get(protectUser, getToken);

router.route('/:token').get(protectUser, VerifyToken);


export default router;