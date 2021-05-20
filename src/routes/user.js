const UserRouter = require("express").Router();
const UploadFileImageUser = require("../middleware/upload/uploadPictureUser");

//midleware for user (buyer + seller(pelapak))
const AuthUser = require("../middleware/auth_user");
//midleware for user (admin)
const AuthAdmin = require("../middleware/auth_admin");

const {
  GetAllUserController,
  GetUserController,
  UpdateProfileUserContoller,
  UpdateImageProfileUserContoller,
} = require("../controllers/user");

//get all data user by admin
UserRouter.get("/user/all", AuthAdmin, GetAllUserController);

UserRouter.get("/user/:id", GetUserController);

// buyer routes
UserRouter.patch(
  "/updateProfileBuyer",
  AuthUser,
  UpdateProfileUserContoller
);
UserRouter.patch(
  "/updateImageProfileBuyer",
  AuthUser,
  UploadFileImageUser.single("image"),
  UpdateImageProfileUserContoller
);

// seller (pelapak) routes
UserRouter.patch(
  "/updateImageProfilePelapak",
  AuthUser,
  UploadFileImageUser.single("image"),
  UpdateImageProfileUserContoller
);
UserRouter.patch(
  "/updateProfilePelapak",
  AuthUser,
  UpdateProfileUserContoller
);

// admin routes
UserRouter.patch(
  "/updateImageProfileAdmin",
  AuthAdmin,
  UploadFileImageUser.single("image"),
  UpdateImageProfileUserContoller
);
UserRouter.patch("/updateProfileAdmin", AuthAdmin, UpdateProfileUserContoller);

module.exports = UserRouter;
