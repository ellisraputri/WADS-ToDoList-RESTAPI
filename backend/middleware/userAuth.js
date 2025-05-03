const userAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        // User is authenticated
        req.body.userId = req.session.userId;
        next();
    } else {
        // Not authenticated
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
};

export default userAuth;
