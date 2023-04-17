const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const savedLocationsSchema = new Schema({
    locationsName: String,
    locationsId: String,
    travelPlan: [],
    travelDate: [],
});

const userSchema = new Schema({
    email: {type: String, required: true, unique: true, lowercase: true},
    password: {type: String, required: true},
    confirmPass: {type: String, required: true},
    savedLocations: [savedLocationsSchema],
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema); 