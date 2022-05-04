import mongoose from 'mongoose';

const userScheme = mongoose.Schema({
    f_name: {
        type: String,
        required: true
    },
    l_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: false
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    followers: {
        type: Array,
        required: false,
    },
    following: {
        type: Array,
        required: false,
    },
    img_url: {
        type: String,
        required: false,
    },
    intro: {
        type: String,
        required: false,
    }
}, { timestamps: true });
export default mongoose.model('User', userScheme);