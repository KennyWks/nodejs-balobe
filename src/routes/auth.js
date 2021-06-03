const AuthRouter = require("express").Router();
const {
    SignupController,
    SigninController,
    ConfirmAccountController,
    ConfirmPassController,
    ForgotPassController,
    ChangePasswordController
} = require('../controllers/auth');

AuthRouter.post("/signup", SignupController);
AuthRouter.post("/login", SigninController);
AuthRouter.get("/confirmAccount", ConfirmAccountController);
AuthRouter.post("/forgotPass", ForgotPassController);
AuthRouter.get("/confirmPass", ConfirmPassController);
AuthRouter.post("/updatePass/:id", ChangePasswordController);

module.exports = AuthRouter;