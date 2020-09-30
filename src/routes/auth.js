const AuthRouter = require("express").Router();
const {
    SignupController,
    LoginController,
    ConfirmController
} = require('../controllers/auth');

AuthRouter.post("/signup", SignupController);
AuthRouter.post("/login", LoginController);
AuthRouter.get("/confirm", ConfirmController);
module.exports = AuthRouter;