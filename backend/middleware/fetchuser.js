const jwt = require("jsonwebtoken");
const jwt_secret = "helloimsaif@goodboy";

const fetchuser = (req, res, next) => {
    // Retrieve token from request header
    const token = req.header("auth-token");

    // Check if token exists
    if (!token) {
        return res
            .status(401)
            .send({ error: "Please authenticate using a valid token" });
    }

    try {
        // Verify the token
        const data = jwt.verify(token, jwt_secret);
        req.user = data.user;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === "TokenExpiredError") {
            return res
                .status(401)
                .send({ error: "Token expired. Please authenticate again" });
        } else if (error.name === "JsonWebTokenError") {
            return res
                .status(401)
                .send({ error: "Invalid token. Please authenticate using a valid token" });
        } else {
            return res.status(500).send({ error: "Internal server error" });
        }
    }
};

module.exports = fetchuser;