const mongoose = require('mongoose');

const mongoURI = process.env.DATABASE;

mongoose.connect(mongoURI, () => {
    console.log("Connection successful...");
})
