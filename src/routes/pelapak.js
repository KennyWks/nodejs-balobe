const PelapakRouter = require("express").Router();
const AuthUser = require("../middleware/auth_user");
const AuthAdmin = require("../middleware/auth_admin");
const UploadLogo = require("../middleware/upload/uploadLogo");

const {
  CreatePelapakController,
  GetAllPelapakContoller,
  GetDetailPelapakController,
  UpdatePelapakController,
  UpdateLogoContoller,
} = require("../controllers/pelapak");

PelapakRouter.post("/", AuthUser, CreatePelapakController);
PelapakRouter.get("/", AuthAdmin, GetAllPelapakContoller);
PelapakRouter.get("/profile", GetDetailPelapakController);
PelapakRouter.patch("/", AuthUser, UpdatePelapakController);
PelapakRouter.patch(
  "/updateImage",
  AuthUser,
  UploadLogo.single("image"),
  UpdateLogoContoller
);

module.exports = PelapakRouter;
