const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String, required: true, unique: true, lowercase: true},
    // firstName: {type: String, required: true},
    // lastName: {type: String, required: true},
    password: {type: String, required: true},
    // confirmPass: {type: String, required: true},
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);