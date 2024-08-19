const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/CloudBook?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false';


const connectToMongo = async() => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
module.exports = connectToMongo;