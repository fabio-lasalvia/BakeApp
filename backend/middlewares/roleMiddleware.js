export function authorizeRoles(...allowedRoles) {
  return (request, response, next) => {
    if (!allowedRoles.includes(request.user.role)) {
      return response.status(403).json({ message: "Access denied" });
    }
    next();
  };
}
