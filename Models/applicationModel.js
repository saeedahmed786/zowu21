const mongoonse = require('mongoose');

const applicationShema = new mongoonse.Schema({
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoonse.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listingId: {
        type: mongoonse.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    status: {
        type: String,
        default: '1'
    },
}, { timestamps: true });

const applicationModel = new mongoonse.model('Application', applicationShema);
module.exports = applicationModel;