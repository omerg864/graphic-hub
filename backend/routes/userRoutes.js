import express from 'express';
const router = express.Router();
import {registerUser, loginUser, getUser, verifyUser, updateFollow, searchUser, getUserByid, updateUser} from '../controllers/userController.js';
import {protectUser} from '../middleWare/authMiddleware.js';

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/:username', getUser);

router.put('/', protectUser, updateUser);

router.get('/verify/:id', verifyUser);

router.get('/follow/:username', protectUser, updateFollow);

router.get('/search/:username', searchUser);

router.get('/id/:id', getUserByid);


export default router;