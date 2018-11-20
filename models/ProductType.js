const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var singleProduct = new Schema({ id: String }, {_id: false});
const prodtype = new Schema({
    name:{
        type: String,
        required: true
    },
    multiName:{
        type: String,
        default: ''
    },
    products:{
        type:[singleProduct],
        default: []
    }
});

module.exports = mongoose.model('productTypes', prodtype);
