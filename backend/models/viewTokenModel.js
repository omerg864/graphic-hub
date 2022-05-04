import mongoose from 'mongoose';


const viewTokenScheme = mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: false
    },
    expires: {
        type: Date,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},  { timestamps: true });

export default mongoose.model('ViewToken', viewTokenScheme);