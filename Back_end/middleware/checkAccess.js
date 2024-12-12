const checkAccess = (role) => {
    return (req, res, next) => {
        if (req.role === role) {
            next();
        } else {
            res.status(403).json({ message: "Forbidden!" });
        }
    };
};

module.exports = checkAccess;
