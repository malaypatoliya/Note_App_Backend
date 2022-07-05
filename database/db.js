const mongoose = require('mongoose');

const mongoURI = process.env.DATABASE;

// const mongoURI = "mongodb+srv://malay:4bWVjcUnl9iav03F@cluster0.c67r7.mongodb.net/Note_App?retryWrites=true&w=majority"

mongoose.connect(mongoURI, () => {
    console.log("Database Connection Successful...");
})

// {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// }
