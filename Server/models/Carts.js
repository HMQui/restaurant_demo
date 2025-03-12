const mongoose = require('mongoose');
const { collection } = require('./Reservation');
const Schema = mongoose.Schema;

const CartsSchema = new Schema ({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "UserAccounts", 
        required: true,
    },
    productId: {
        type: String, 
        ref: "Products", 
        required: true,
    },
    quantity: {
        type: Number,
        require: true,
    }
}, {
    collection: "Carts",
})

module.exports = mongoose.model("CartsModel", CartsSchema)
