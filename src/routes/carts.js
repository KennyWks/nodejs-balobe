const CartsRouter = require("express").Router();
const AuthUser = require("../middleware/auth_user");
const {
    CreateCartsController,
    GetAllCartsController,
    GetDetailCartsController,
    CheckOutContoller
} = require("../controllers/carts");

// CartsRouter.post("/", CreateCategory);
CartsRouter.post("/", AuthUser, CreateCartsController);
CartsRouter.get("/", AuthUser, GetAllCartsController);
CartsRouter.get("/:id", AuthUser, GetDetailCartsController);
CartsRouter.post("/:id", AuthUser, CheckOutContoller);

module.exports = CartsRouter;