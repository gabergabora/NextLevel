const mongoose = require('mongoose');
const MONGO_URI = "mongodb://localhost:27017/NextLevel"

mongoose.connect(MONGO_URI, (err) => {
    if(err){
        console.log(err);
    } else {
        console.log("Database is running");
    }
})