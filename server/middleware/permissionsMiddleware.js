const authorizePermissions = (...requiredPermissions) => (req, res, next) => {
  if (!req.user || !req.user.permissions.some(p => requiredPermissions.includes(p))) {
    return res.status(403).json({ message: "Forbidden: insufficient permissions" });
  }
  next();
};

export default authorizePermissions;