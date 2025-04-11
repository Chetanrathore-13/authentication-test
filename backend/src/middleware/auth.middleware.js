import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authenticate = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    // No token case
    if (!accessToken && !refreshToken) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Try verifying access token
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      // Access token invalid or expired — try refresh token
      if (!refreshToken) {
        return res.status(401).json({ message: "Session expired, please login again" });
      }

      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedRefresh.id);

        if (!user) {
          return res.status(403).json({ message: "Invalid refresh token" });
        }

        // Generate new tokens
        const newAccessToken = jwt.sign(
          { id: user._id, name: user.name },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
        );

        const newRefreshToken = jwt.sign(
          { id: user._id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
        );

        // Set new cookies
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          sameSite: "Strict",
          maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          sameSite: "Strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        req.user = { id: user._id, name: user.name };
        return next();
      } catch (refreshErr) {
        return res.status(403).json({ message: "Refresh token invalid or expired" });
      }
    }
  } catch (outerErr) {
    return res.status(500).json({ message: "Authentication failed", error: outerErr.message });
  }
};
