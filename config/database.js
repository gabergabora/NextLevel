const mongoose = require('mongoose');
const MONGODB_URL = process.env.MONGODB_URL

mongoose.connect(MONGODB_URL, (err) => {
    if(err){
        console.log(err);
    } else {
        console.log("Database is running");
    }
})
