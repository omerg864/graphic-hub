import express from 'express';
const router = express.Router();
import {getProjects, addProject, updateProject, deleteProject, getProject, getProjectsByUser, getPrivateProjects, searchProjects} from '../controllers/projectController.js';
import { protectUser} from '../middleware/authMiddleware.js';

router.route('/').get(protectUser, getProjects).post(protectUser, addProject);

router.route('/:id').put(protectUser, updateProject).delete(protectUser, deleteProject);

router.route('/user/:username').get(protectUser, getProjectsByUser);

router.route('/project/:username/:name').get(protectUser, getProject);

router.route('/private').get(protectUser, getPrivateProjects);

router.route('/search/:query').get(searchProjects);


export default router;