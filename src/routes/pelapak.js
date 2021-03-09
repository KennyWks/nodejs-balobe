const PelapakRouter = require("express").Router();
const AuthBuyer = require("../middleware/auth_buyer");
const AuthSeller = require("../middleware/auth_seller");
const AuthAdmin = require("../middleware/auth_admin");
const Authentication = require("../middleware/authentication");
const UploadLogo = require("../middleware/upload/uploadLogo");

const {
  CreatePelapakController,
  GetAllPelapakContoller,
  GetDetailPelapakController,
  UpdatePelapakController,
  UpdateLogoContoller,
} = require("../controllers/pelapak");

PelapakRouter.post("/", Authentication, CreatePelapakController);
PelapakRouter.get("/", AuthAdmin, GetAllPelapakContoller);
PelapakRouter.get("/profile", AuthSeller, GetDetailPelapakController);
PelapakRouter.patch("/", AuthSeller, UpdatePelapakController);
PelapakRouter.patch(
  "/updateImage",
  AuthSeller,
  UploadLogo.single("image"),
  UpdateLogoContoller
);

module.exports = PelapakRouter;
