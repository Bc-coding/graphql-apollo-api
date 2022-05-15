const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config();

const connection = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connected successfully!");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connection;
