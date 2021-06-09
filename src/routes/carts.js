const CartsRouter = require("express").Router();
const AuthUser = require("../middleware/auth_user");
const {
  CreateCartsController,
  GetAllCartsController,
  GetDetailCartsController,
  UpdateCartsController,
  CheckOutContoller,
  CheckOutCheckedController,
  DeleteCartsController,
} = require("../controllers/carts");

// CartsRouter.post("/", CreateCategory);
CartsRouter.post("/", AuthUser, CreateCartsController);
CartsRouter.get("/", AuthUser, GetAllCartsController);
CartsRouter.get("/:id", AuthUser, GetDetailCartsController);
CartsRouter.delete("/:id", AuthUser, DeleteCartsController);
CartsRouter.patch("/checkout/checked", AuthUser, CheckOutCheckedController);
CartsRouter.patch("/update/:id", AuthUser, UpdateCartsController);
CartsRouter.post("/checkout/:id", AuthUser, CheckOutContoller);

module.exports = CartsRouter;
