// require dependencies
const express = require('express');
const mongoose = require('mongoose');

// initialize the application
const app = express();

//config application settings
require('dotenv').config()
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

//establish connection to mongodb
mongoose.set('strictQuery', true);
mongoose.connect(DATABASE_URL);

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MongoDB');
});

db.on('error', (err) => {
    console.log(`An error occured with MongoDB: ${err.message}`);
});

//mount middleware

//mount routes

//tell the application to listen on a dedicated port.
app.listen(PORT, () => {
    console.log(`Express is listening on port: ${PORT}`);
})