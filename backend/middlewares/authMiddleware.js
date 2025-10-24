import { verifyJWT } from "../helpers/jwt.js";
import User from "../models/User.js";
import { createError } from "../helpers/createError.js";

export async function protect(request, response, next) {
  try {
    const header = request.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return next(createError(401, "Missing or invalid token"));
    }

    const token = header.split(" ")[1];
    const decoded = verifyJWT(token);

    if (!decoded?.id) {
      return next(createError(401, "Invalid token payload"));
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(createError(404, "User not found"));
    }

    request.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(createError(401, "Token expired"));
    }
    return next(createError(401, "Unauthorized"));
  }
}
