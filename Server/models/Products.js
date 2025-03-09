const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Products
let Products = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        dropDups: true,
    },
    name: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    subTitle: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String
    }
}, {
    collection: 'Products'
});

module.exports = mongoose.model('Products', Products);