const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new Schema({
    name: {type: String, required: true},
    img: String,
    description: String,
    hotels: String,
    attractions: String,
    date: String,
    travelPlan: String,
});

module.exports = mongoose.model('location', locationSchema);