const ItemRouter = require("express").Router();
const UploadImageItem = require("../middleware/upload/uploadImageItem");
const AuthPelapak = require("../middleware/auth_pelapak");
const Authentication = require("../middleware/authentication");

const {
    CreateItemController,
    GetAllItemController,
    GetAllItemPelapakController,
    GetDetailItemController,
    UpdateItemContoller,
    DeleteItemController,
    UpdateItemImageContoller,
    CreateReviewController,
    UpdateReviewController,
    GetReviewByUserController,
    GetReviewByIdController,
    GetAllReviewController,
    GetReviewByIdItemController
} = require("../controllers/item");

// routes for items
ItemRouter.post("/", AuthPelapak, UploadImageItem.single("image"), CreateItemController);
ItemRouter.get("/", GetAllItemController);
ItemRouter.get("/pelapak/:id", AuthPelapak, GetAllItemPelapakController);
ItemRouter.get("/:id", GetDetailItemController);
ItemRouter.patch("/:id", AuthPelapak, UpdateItemContoller);
ItemRouter.delete("/:id", AuthPelapak, DeleteItemController);
ItemRouter.patch("/updateItemImage/:id_item", AuthPelapak, UploadImageItem.single("image"), UpdateItemImageContoller);

// routes for review items
ItemRouter.get("/review/user", Authentication, GetReviewByUserController);
ItemRouter.get("/review/:id", GetReviewByIdController);
ItemRouter.get("/review/item/:id", GetReviewByIdItemController);
ItemRouter.get("/review/all/data", GetAllReviewController);
ItemRouter.post("/review", Authentication, CreateReviewController);
ItemRouter.patch("/review/:id", Authentication, UpdateReviewController);

module.exports = ItemRouter;