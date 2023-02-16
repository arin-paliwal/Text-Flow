const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify:true,
    });
    console.log(`MongoDB Connected:${conn.connection.host}`);
  } catch (error) {
    console.log(`Error:${error.message}`);
  }
};
module.exports = connectDB;