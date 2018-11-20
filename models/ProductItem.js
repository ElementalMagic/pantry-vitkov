const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    prodType:{
        type: String,
        required: true
    },
    collectionId:{
        type: Schema.Types.ObjectId,
        required: false
    },
    vendorCode: {
        type: String,
        required: true
    },
    barcode: {
        type: String,
        required: true
    },
    weight: {
        type: String,
        required: true
    },
    equipment:{
        type: String,
        required: true
    },
    specs:{
        type: String,
        required: true
    },
    cost:{
        type: Number,
        required: true
    },
    marketUrl:{
        type: String,
        default: '#'
    },
    imgSrc:{
        type: String,
        required: false
    },
    imgSrcsetTag: [{type: String, _id: false}],
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('items', itemSchema);
