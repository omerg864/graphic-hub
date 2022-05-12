import mongoose from 'mongoose';


const workFlowModel = mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    jobs : {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},  { timestamps: true });

export default mongoose.model('WorkFlow', workFlowModel);