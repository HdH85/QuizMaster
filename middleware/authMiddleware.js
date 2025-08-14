const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        
        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = {
            id: decodedToken.id,
            username: decodedToken.username,
            role: decodedToken.role
        };
        
        next();
    } catch (error) {
        console.error('Auth error', error);
        return res.status(401).json({
            message: 'Unauthorized'})
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.userType === 1) {
        next();
    } else {
        res.status(403).json({
            message: 'Admin only access!'
        });
    }
}

module.exports = {
    isAuth,
    isAdmin
}