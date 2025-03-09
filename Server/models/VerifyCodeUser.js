const mongoose = require("mongoose");

const VerifyCodeUserSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserAccounts", required: true },
    email: { type: String, required: true },
    secretCode: { type: String, required: true },
    createdAt: { type: Date, default: Date.now(), expires: 300 }
}, {
    timestamps: true,
    collection: "VerifyCodeUser"
});

module.exports = mongoose.model("VerifyCodeUser", VerifyCodeUserSchema);
