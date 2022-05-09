import express from 'express';
const router = express.Router();
import {getProjects, addProject, updateProject, deleteProject, getProject, getPrivateProjects, searchProjects} from '../controllers/projectController.js';
import { protectUser, getUserSign } from '../middleware/authMiddleware.js';

router.route('/').get(getProjects).post(protectUser, addProject);

router.route('/:id').put(protectUser, updateProject).delete(protectUser, deleteProject);

router.route('/project/:username/:name').get(getUserSign, getProject);

router.route('/private').get(protectUser, getPrivateProjects);

router.route('/search/:query').get(searchProjects);


export default router;