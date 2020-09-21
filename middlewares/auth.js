const jwt = require('jsonwebtoken');
const { onError } = require('../constants/global');
const { publicKey, verifyOptions } = require('../constants/JWTService');
exports.isAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return onError("User not Authenticated!");
    }
    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token, publicKey, verifyOptions)
        if (!decodedToken) {
            const error = new Error("Not authorized!");
            error.statusCode = 500;
            throw error;
        }
        req.userId = decodedToken.userId;
    } catch (error) {
        onError(error.toString(), 500, null, true, next);
    } finally {
        next();
    }

}