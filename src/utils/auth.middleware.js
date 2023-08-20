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

const isAdmin = (req, res, next) => {
    if (req.session.user.role === "admin" || req.session.user.email === 'adminCoder@coder.com' && req.session.user.password === 'adminCod3r123' ){
        next()
    } else {
        res.status(403).json({ message: 'Acceso no autorizado.' });
    }
}

export { isAuthenticated, isAdmin, isLogged };