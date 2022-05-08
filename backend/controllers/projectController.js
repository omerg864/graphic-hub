import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Project from '../models/projectModel.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });



const populate_user = {path: 'user', select: ['-password', '-__v', '-createdAt', '-updatedAt', '-verified']};

const getProjects = asyncHandler(async (req, res, next) => {
    const query = req.query;
    var count = Object.keys(query).length;
    if (count === 0){
        var projects = await Project.find({visibility: "public"}).populate(populate_user).sort({updatedAt: -1});
        res.status(200).json({
            success: true,
            projects: projects
        });
    } else {
        if (Object.keys(query).includes('username') && Object.keys(query).includes('orderBy')) {
            const user = await User.findOne({username: query.username});
            if (!user) {
                res.status(404);
                throw new Error('User not found');
            }
            var projects = await Project.find({user: user, visibility: "public"}).populate(populate_user).sort({[query.orderBy]: -1});
        } else if (Object.keys(query).includes('username')) {
            const user = await User.findOne({username: query.username});
            if (!user) {
                res.status(404);
                throw new Error('User not found');
            }
            var projects = await Project.find({user: user, visibility: "public"}).populate(populate_user);
        } else if (Object.keys(query).includes('orderBy') && Object.keys(query).includes('following')) {
            const users = await User.find({username: {$in: query.following.split(',')}});
            var ids = [];
            users.forEach(user => {
                ids.push(user._id);
            });
            var projects = await Project.find({user: {$in: ids}, visibility: "public"}).populate(populate_user).sort({[query.orderBy]: -1});
        } else if (Object.keys(query).includes('following')) {
            const users = await User.find({username: {$in: query.following.split(',')}});
            var projects = await Project.find({user: {$in: users._id}, visibility: "public"}).populate(populate_user);
        } else if (Object.keys(query).includes('orderBy')) {
            var projects = await Project.find({visibility: "public"}).populate(populate_user).sort({[query.orderBy]: -1});
        }
        else {
            res.status(400);
            throw new Error('Invalid query');
        }
        res.status(200).json({
            success: true,
            projects: projects
        });
    }
});

const addProject = asyncHandler(async (req, res, next) => {
    const {name, description, visibility, images} = req.body;
    const checked_project = await Project.find({name: name, user: req.user});
    if (checked_project.length > 0) {
        res.status(400)
        throw new Error('Project already exists');
    }
    const project = await Project.create({
        name: name,
        description: description,
        user: req.user,
        visibility: visibility,
        images: images
    });
    res.status(200).json({
        success: true,
        project: project
    });
});

const updateProject = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const project = await Project.findById(id);
    if (!project) {
        res.status(404)
        throw new Error('Project not found');
    }
    var count = Object.keys(req.body).length;
    if (project.user.toString() !== req.user.id && count !== 0) {
        res.status(401)
        throw new Error('You are not authorized to update this project');
    }
    if (count > 0) {
        req.body.deleteimages.forEach(image => {
            var public_id = "graphic hub/" + image.split('/').pop().split('.')[0];
            console.log(public_id);
            try {
                cloudinary.uploader.destroy(public_id, {
                    cloud_name: process.env.CLOUD_NAME, 
                    api_key: process.env.CLOUDINARY_API_KEY, 
                    api_secret: process.env.CLOUDINARY_API_SECRET,
                    secure: true,
                    invalidate: true,
                    resource_type: 'image'
                }, function(error,result) {
                    console.log(result, error) }
                );
            }
            catch (err) {
                console.log(err);
            }
        });
        var updatedProject = await Project.findByIdAndUpdate(id, {
            ...req.body
        }, {new: true}).populate(populate_user);
    } else {
        if (project.likes.includes(req.user.username)) {
            var updatedProject = await Project.findByIdAndUpdate(id, {
                $pull: {
                    likes: req.user.username
                }
            }, {new: true, timestamps: false}).populate(populate_user);
        } else {
            var updatedProject = await Project.findByIdAndUpdate(id, {
                $push: {
                    likes: req.user.username
                }
            }, {new: true, timestamps: false}).populate(populate_user);
        }
    }
    res.status(200).json({
        success: true,
        project: updatedProject
    });
});

const deleteProject = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const project = await Project.findById(id);
    if (!project) {
        res.status(404)
        throw new Error('Project not found');
    }
    if (project.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('You are not authorized to delete this project');
    }
    await Project.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        id: id
    });
});

const getProject = asyncHandler(async (req, res, next) => {
    const {name, username} = req.params;
    const user = await User.findOne({username: username});
    const project = await Project.findOne({name: name, user: user}).populate(populate_user);
    if (!project) {
        res.status(404)
        throw new Error('Project not found');
    }
    if (project.user._id.toString() !== req.user._id.toString() && project.visibility !== 'public') {
        res.status(401)
        throw new Error('You are not authorized to view this project');
    }
    res.status(200).json({
        success: true,
        project: project
    });
});

const getPrivateProjects = asyncHandler(async (req, res, next) => {
    const projects = await Project.find({user: req.user, visibility: 'private'}).populate(populate_user);
    res.status(200).json({
        success: true,
        projects: projects
    });
});

const searchProjects = asyncHandler(async (req, res, next) => {
    const {query} = req.params;
    const projects = await Project.find({$or :
        [
        {name: {$regex: query, $options: 'i'}},
        {description: {$regex: query, $options: 'i'}}
    ], $and : [{visibility: 'public'}]}).populate(populate_user);
    res.status(200).json({
        success: true,
        projects: projects
    });
});


export {getProjects, addProject, updateProject, deleteProject, getProject, getPrivateProjects, searchProjects};