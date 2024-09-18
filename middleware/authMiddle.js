const authenticateUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/signIn');
    }
}

module.exports = authenticateUser;