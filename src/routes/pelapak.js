const PelapakRouter = require("express").Router();
const AuthSeller = require("../middleware/auth_seller");
const AuthAdmin = require("../middleware/auth_admin");
const UploadLogo = require("../middleware/upload/uploadLogo");

const {
    CreatePelapakController,
    GetAllPelapakContoller,
    GetDetailPelapakController,
    UpdatePelapakController,
    UpdateFotoItemContoller
} = require("../controllers/pelapak");

PelapakRouter.post("/", AuthSeller, CreatePelapakController);
PelapakRouter.get("/", AuthAdmin, GetAllPelapakContoller);
PelapakRouter.get("/:id", AuthSeller, GetDetailPelapakController);
PelapakRouter.patch("/:id", AuthSeller, UpdatePelapakController);
PelapakRouter.patch("/", AuthSeller, UploadLogo.single("image"), UpdateFotoItemContoller);

module.exports = PelapakRouter;