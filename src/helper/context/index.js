const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../../database/models/user");

module.exports.verifyUser = async (req) => {
  try {
    req.email = null;
    req.loggedInUserId = null;

    // console.log(req.headers);
    const bearerHeader = req.headers.authorization;
    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];
      // console.log("===", token);
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY || "mysecretkey"
      );
      req.email = payload.email;
      const user = await User.findOne({ email: payload.email });
      req.loggedInUserId = user.id;
      console.log("Token has been checked successfully");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
