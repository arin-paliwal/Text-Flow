const jwt = require("jsonwebtoken");
// import { dotenv } from "dotenv";
const User = require("../Models/userModel.js");
const asyncHandler = require("express-async-handler");
// dotenv.config();

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded);

      req.user = await User.findById(decoded.id).select("-password");
      next();
      // console.log("Welcome");
    } catch (error) {
      console.log("error in authMiddle"+error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };