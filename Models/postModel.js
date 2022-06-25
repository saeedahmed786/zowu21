const mongoonse = require('mongoose');

const postSchema = new mongoonse.Schema({
    description: {
        type: String,
        required: true
    },
    file: {
        type: Object,
        required: true
    },
    user: {
        type: mongoonse.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    views: {
        type: Array,
        default: []
    },
    likes: {
        type: Array,
        default: []
    },
    comments: [{
        text: {
            type: String,
            required: true
        },
        user: {
            type: mongoonse.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }]
}, { timestamps: true });

const postModel = new mongoonse.model('Post', postSchema);
module.exports = postModel;