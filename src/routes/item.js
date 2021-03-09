const ItemRouter = require("express").Router();
const UploadImageItem = require("../middleware/upload/uploadImageItem");
const AuthUser = require("../middleware/auth_user");

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
ItemRouter.post("/", AuthUser, UploadImageItem.single("image"), CreateItemController);
ItemRouter.get("/", GetAllItemController);
ItemRouter.get("/:id", GetDetailItemController);
ItemRouter.patch("/:id", AuthUser, UpdateItemContoller);
ItemRouter.delete("/:id", AuthUser, DeleteItemController);
ItemRouter.get("/pelapak/:id", AuthUser, GetAllItemPelapakController);
ItemRouter.patch("/updateItemImage/:id_item", AuthUser, UploadImageItem.single("image"), UpdateItemImageContoller);

// routes for review items
ItemRouter.get("/review/user", AuthUser, GetReviewByUserController);
ItemRouter.get("/review/:id", GetReviewByIdController);
ItemRouter.get("/review/item/:id", GetReviewByIdItemController);
ItemRouter.get("/review/all/data", GetAllReviewController);
ItemRouter.post("/review", AuthUser, CreateReviewController);
ItemRouter.patch("/review/:id", AuthUser, UpdateReviewController);

module.exports = ItemRouter;