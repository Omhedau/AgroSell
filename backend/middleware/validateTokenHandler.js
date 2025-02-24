const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  console.log("I am in validateToken");

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.seller = decoded; // Updated from req.user to req.seller
    console.log("Decoded Token:", decoded);
    console.log("Token Authorized");
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
});

module.exports = validateToken;
