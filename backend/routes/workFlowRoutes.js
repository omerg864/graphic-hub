import express from 'express';
const router = express.Router();
import { getWorkFlow, updateWorkFlow } from '../controllers/workFlowController.js';
import {protectUser} from '../middleware/authMiddleware.js';


router.route('/').get(getWorkFlow).put(protectUser, updateWorkFlow);

export default router;
