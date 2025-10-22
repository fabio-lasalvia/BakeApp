import jwt from "jsonwebtoken";

export function signJWT(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN || "1d",
  });
}

export function verifyJWT(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
