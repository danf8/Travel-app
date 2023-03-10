const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String, required: true, unique: true, lowercase: true},
    password: {type: String, required: true},
    confirmPass: {type: String, required: true},
    savedLocations: [{
        locationsName: String,
        locationsId: String,
        travelPlan: [],
        travelDate: []
    }]
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);