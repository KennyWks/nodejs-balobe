const PelapakRouter = require("express").Router();
const AuthPelapak = require("../middleware/auth_pelapak");
const AuthAdmin = require("../middleware/auth_admin");
const UploadLogo = require("../middleware/upload/uploadLogo");

const {
    CreatePelapakController,
    GetAllPelapakContoller,
    GetDetailPelapakController,
    UpdatePelapakController,
    UpdateLogoContoller
} = require("../controllers/pelapak");

PelapakRouter.post("/", AuthPelapak, CreatePelapakController);
PelapakRouter.get("/", AuthAdmin, GetAllPelapakContoller);
PelapakRouter.get("/profile", AuthPelapak, GetDetailPelapakController);
PelapakRouter.patch("/", AuthPelapak, UpdatePelapakController);
PelapakRouter.patch("/updateImage", AuthPelapak, UploadLogo.single("image"), UpdateLogoContoller);

module.exports = PelapakRouter;