const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const login = asyncHandler(async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    if (!phoneNumber || !password)
      return res
        .status(400)
        .json({ message: "Phone and password are required." });

    const foundUser = await User.findOne({ phoneNumber }).exec();

    if (!foundUser) {
      return res.status(401).json({ message: "Unauthorized: user not found." });
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match)
      return res.status(401).json({ message: "Unauthorized: wrong password." });

    const access_token = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          phoneNumber: foundUser.phoneNumber,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "55m" }
    );

    const refresh_token = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          phoneNumber: foundUser.phoneNumber,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      data: { tokens: { access_token, refresh_token } },
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded.UserInfo; // Store decoded user information in request object
    const { id, firstName, lastName, phoneNumber } = req.user;
    res.status(200).json({ id, firstName, lastName, phoneNumber });
    next(); // Proceed to the next middleware
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token has expired." });
    } else {
      console.error("Token verification error:", error);
      return res.status(403).json({ message: "Forbidden: Invalid token." });
    }
  }
});

const refreshToken = async (req, res, next) => {
  const refreshToken = req.body.refresh_token;
  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing refresh token." });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    // Generate a new access token
    const access_token = jwt.sign(
      { UserInfo: decoded.UserInfo },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "55m" }
    );
    // Generate a new refresh token
    const refresh_token = jwt.sign(
      { UserInfo: decoded.UserInfo },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // Attach the new access token and refresh token to the response object
    res.json({ data: { tokens: { access_token, refresh_token } } });
  } catch (error) {
    console.error("Token verification error:", error);
    return res
      .status(403)
      .json({ message: "Forbidden: Invalid refresh token." });
  }
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204).json({ message: "No Content" });

  res.clearCookie("jwt", { expiresIn: new Date(0) });
  res.json({ message: "Cookie cleared" });
};

module.exports = { login, logout, authenticateToken, refreshToken };
