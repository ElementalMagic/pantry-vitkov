const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collection = new Schema({
    name:{
      type: String,
      required: true
    },
    title:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('collection', collection);
