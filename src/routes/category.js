const CategoryRouter = require("express").Router();
const AuthAdmin = require("../middleware/auth_admin");
const {
    CreateCategoryController,
    GetAllCategoryController,
    GetDetailCategoryController,
    UpdateCategoryController,
    DeleteCategoryController
} = require("../controllers/category");

// CategoryRouter.post("/", CreateCategory);
CategoryRouter.post("/", AuthAdmin, CreateCategoryController);
CategoryRouter.get("/", GetAllCategoryController);
CategoryRouter.get("/:id", GetDetailCategoryController);
CategoryRouter.patch("/:id", AuthAdmin, UpdateCategoryController);
CategoryRouter.delete("/:id", AuthAdmin, DeleteCategoryController);

module.exports = CategoryRouter;