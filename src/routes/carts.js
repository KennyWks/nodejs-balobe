const CartsRouter = require("express").Router();
const Authentication = require("../middleware/authentication");
const {
    CreateCartsController,
    GetAllCartsController,
    GetDetailCartsController,
    CheckOutContoller
} = require("../controllers/carts");

// CartsRouter.post("/", CreateCategory);
CartsRouter.post("/", Authentication, CreateCartsController);
CartsRouter.get("/", Authentication, GetAllCartsController);
CartsRouter.get("/:id", Authentication, GetDetailCartsController);
CartsRouter.post("/:id", Authentication, CheckOutContoller);

module.exports = CartsRouter;