const jwt = require('jsonwebtoken');
const JWT_SECRET = "malay";

const fetchuser = (req, res, next) => {
    // Get jwt token 
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }

    try {
        // Get user data (user id) from token
        const userData = jwt.verify(token, JWT_SECRET);

        // send id to req object in request parameter
        req.id = userData.userId;

        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }


}

module.exports = fetchuser;