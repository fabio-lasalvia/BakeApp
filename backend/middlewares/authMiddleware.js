import { verifyJWT } from "../helpers/jwt.js";
import User from "../models/User.js";

export async function protect(request, response, next) {
  const header = request.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return response.status(401).json({ message: "Missing or invalid token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = verifyJWT(token);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return response.status(401).json({ message: "User not found" });
    }

    request.user = user;
    next();
  } catch (error) {
    return response.status(401).json({ message: "Unauthorized" });
  }
}
