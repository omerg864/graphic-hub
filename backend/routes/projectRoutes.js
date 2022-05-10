import express from 'express';
const router = express.Router();
import {getProjects, addProject, updateProject, deleteProject, getProject, getMyProjects, searchProjects, getViewProjects, getViewProject} from '../controllers/projectController.js';
import { protectUser, getUserSign, verifyViewToken } from '../middleware/authMiddleware.js';

router.route('/').get(getProjects).post(protectUser, addProject);

router.route('/:id').put(protectUser, updateProject).delete(protectUser, deleteProject);

router.route('/project/:username/:name').get(getUserSign, getProject);

router.route('/my').get(protectUser, getMyProjects);

router.route('/search/:query').get(searchProjects);

router.route('/accessViewProjects').post(verifyViewToken, getViewProjects);

router.route('/accessViewProject').post(verifyViewToken, getViewProject);


export default router;