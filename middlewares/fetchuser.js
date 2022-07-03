const jwt = require('jsonwebtoken');
const JWT_SECRET = "malay";

const fetchuser = (req, res, next) => {
    // Get jwt token 
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ Error: "Please authenticate using a valid token" })
    }
    try {
        if (token) {
            // Get user data (user id) from token
            const userData = jwt.verify(token, JWT_SECRET);
            if (userData) {
                // send id to req object in request parameter
                req.id = userData.userId;
            } else {
                res.status(400).send({ Error: "Login with valid token" })
            }
        }
        next();
    } catch (error) {
        res.status(400).send({ Error: "Internal server error !!!" })
    }
}

module.exports = fetchuser;