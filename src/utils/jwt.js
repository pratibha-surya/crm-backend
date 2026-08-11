import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be configured");
  }

  return process.env.JWT_SECRET;
};

export const generateToken = (payload) => {
  return jwt.sign(
    payload,
    getJwtSecret(),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h"
    }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(
    token,
    getJwtSecret()
  );
};
