import { verifyJWT } from "../helpers/jwt.js";
import User from "../models/User.js";
import { createError } from "../helpers/createError.js";

export async function protect(request, response, next) {
  try {
    const header = request.headers.authorization;

    // Controlla presenza header
    if (!header || !header.startsWith("Bearer ")) {
      return next(createError(401, "Authentication token missing"));
    }

    // Estrazione token
    const token = header.split(" ")[1];
    if (!token) {
      return next(createError(401, "Invalid authentication token"));
    }

    // Verifica validità token
    let decoded;
    try {
      decoded = verifyJWT(token);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return next(createError(401, "Token expired, please log in again"));
      }
      return next(createError(401, "Invalid token"));
    }

    // Verifica payload valido
    if (!decoded || !decoded.id) {
      return next(createError(401, "Invalid token payload"));
    }

    // Recupera utente dal DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(createError(404, "User associated with this token no longer exists"));
    }

    // Salva utente nella request per gli altri middleware/controller
    request.user = user;

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return next(createError(401, "Not authorized"));
  }
}
