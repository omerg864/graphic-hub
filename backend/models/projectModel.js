import mongoose from 'mongoose';

const projectScheme = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    visability: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        required: false
    },
    likes: {
        type: Array,
        required: false
    }

},  { timestamps: true });

export default mongoose.model('Project', projectScheme);