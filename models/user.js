const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String, required: true, unique: true, lowercase: true},
    password: {type: String, required: true},
    confirmPass: {type: String, required: true},
    locations: [],
    // changed this for save
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);