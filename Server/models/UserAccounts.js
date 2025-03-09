const mongoose = require('mongoose');

const UserAccountsSchema = new mongoose.Schema({
    id_provider: { type: String, default: null },
    username: { type: String, required: true },
    password: { type: String, default: null },
    fullname: { type: String, required: true },
    sexual: { type: String, default: 'unknown' },
    dateOfBirth: { type: Date },
    email: { type: String, default: '', unique: false },
    role: { type: String, default: 'user' },
    provider: { type: String, default: 'local', required: true },
    avatar: { type: String, default: null }
}, {
    timestamps: true,
    collection: 'UserAccounts'
});

module.exports = mongoose.model('UserAccounts', UserAccountsSchema);
