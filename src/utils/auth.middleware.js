const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/session/login');
    }
};

const isLogged = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/productos');
    } else {
        next();
    }
}

const userOrPremium = (req, res, next) => {
    const user = req.session.user;
    if (user.role !== 'user' && user.role !== 'premium') {
        res.status(403).json({
            message: 'Forbidden'
        });
    } else {
        next();
    }
}

const isAdminOrPremium = (req, res, next) => {
    if (req.user.role === "admin"|| req.user.role === "premium" || req.user.email === 'adminCoder@coder.com' && req.user.password === 'adminCod3r123' ){
        next()
    } else {
        res.status(403).json({ message: 'Acceso no autorizado.' });
    }
}

const isUser = (req, res, next) => {
    if (req.session.user.role === "user"){
        next()
    } else {
        res.status(403).json({ message: 'Acceso no autorizado.' });
    }
}


export { isAuthenticated, isAdminOrPremium, isLogged, isUser, userOrPremium };