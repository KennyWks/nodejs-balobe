const UserRouter = require("express").Router();
const UploadFileImageUser = require("../middleware/upload/uploadPictureUser");

//midleware for user (buyer)
const Authentication = require("../middleware/authentication");
//midleware for user (pelapak)
const AuthPelapak = require("../middleware/auth_pelapak");
//midleware for user (admin)
const AuthAdmin = require("../middleware/auth_admin");

const {
    GetAllUserController,
    GetUserController,
    UpdateImageProfileUserContoller,
    UpdateProfileUserContoller
} = require("../controllers/user");

//get all data user by admin
UserRouter.get('/all', AuthAdmin, GetAllUserController);

UserRouter.get('/user/:id', GetUserController);

// buyer routes
UserRouter.patch('/updateImageProfileBuyer', Authentication, UploadFileImageUser.single("image"), UpdateImageProfileUserContoller);
UserRouter.patch('/updateProfileBuyer', Authentication, UpdateProfileUserContoller);

// pelapak routes
UserRouter.patch('/updateImageProfilePelapak', AuthPelapak, UploadFileImageUser.single("image"), UpdateImageProfileUserContoller);
UserRouter.patch('/updateProfilePelapak', AuthPelapak, UpdateProfileUserContoller);

// admin routes
UserRouter.patch('/updateImageProfileAdmin', AuthAdmin, UploadFileImageUser.single("image"), UpdateImageProfileUserContoller);
UserRouter.patch('/updateProfileAdmin', AuthAdmin, UpdateProfileUserContoller);

module.exports = UserRouter;