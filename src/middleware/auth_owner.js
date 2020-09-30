require('dotenv').config();
const jwt = require("jsonwebtoken");

async function AuthOwner(req, res, next) {
    try {
        let token = req.headers.authorization || "";
        if (!token) {
            throw new Error("Not Authorized")
        }
        token = token.replace(/Bearer\s*/, "");
        const payload = jwt.verify(token, "owner12345");
        req.auth = payload;
        if (req.auth.role_id === 1) {
            next();
        } else {
            throw new Error("You don't have permission")
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            msg: error.message || "Not Authorized"
        })
    }
}

module.exports = AuthOwner;