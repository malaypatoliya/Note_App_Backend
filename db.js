const mongoose = require('mongoose');

const mongoURI = "mongodb://localhost:27017/loginsystem";

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connection successful...");
    })
}

module.exports = connectToMongo;