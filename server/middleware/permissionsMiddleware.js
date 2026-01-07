const authorizePermissions = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !req.user.permissions.some(p => allowedRoles.includes(p))) {
    return res.status(403).json({ message: "Forbidden: insufficient permissions" });
  }
  next();
};

export default authorizePermissions;