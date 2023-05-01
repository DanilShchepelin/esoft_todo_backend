module.exports = (req, res, next) => {
    try {
        const userId = req.session.user.id;
        if (userId) {
            next();
        } else {
            res.redirect("/login");
        }
    } catch {
        res.status(401).json({
            error: new Error('Ошибка запроса')
        });
    }
};