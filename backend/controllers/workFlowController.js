import asyncHandler from 'express-async-handler';
import WorkFlow from '../models/workFlowModel.js';
import User from '../models/userModel.js';


const getWorkFlow = asyncHandler(async (req, res, next) => {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const user = await User.findOne({ username: req.query.username });
    if (!user) {
        res.status(404)
        throw new Error('User does not exist');
    }
    var workFlow = await WorkFlow.find({date: {$gte: new Date(date.getFullYear() - 1, date.getMonth(), date.getDate()), $lte: date}, user: user._id}).sort({date: 1});
    var sortedWorkFlow = [];
    workFlow.map(workFlow => {
        sortedWorkFlow.push({date : `${workFlow.date.getFullYear()}/${workFlow.date.getMonth()}/${workFlow.date.getDate()}`, count: workFlow.jobs});
    });
    res.status(200).json({
        success: true,
        workFlow: sortedWorkFlow,
        date: date
    });
});


const updateWorkFlow = asyncHandler(async (req, res, next) => {
    const { date } = req.body;
    const date1 = new Date(date);
    var workFlow = await WorkFlow.findOne({ date: date1.toLocaleDateString(), user: req.user._id });
    if (!workFlow) {
        workFlow = await WorkFlow.create({ date: date1.toLocaleDateString(), jobs: 1, user: req.user._id });
    }
    else {
        workFlow.jobs += 1;
        workFlow.save();
    }
    res.status(200).json({
        success: true,
        workFlow: workFlow
    });
});




export { getWorkFlow, updateWorkFlow };