const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "UserAccounts", 
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true
    },
    partySize: {
        type: Number,
        required: true
    },
    notices: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    served: {
        type: Boolean,
        default: false,
    },
    expired: {
        type: Boolean,
        default: false,
    },
}, { 
    timestamps: true, 
    collection: "Reservation",
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
