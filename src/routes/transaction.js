const TransactionRouter = require("express").Router();
const AuthUser = require("../middleware/auth_user");
const {
  CreateTransactionController,
  GetDetailTransactionController,
  GetAllTransactionController,
} = require("../controllers/transaction");

TransactionRouter.post("/", AuthUser, CreateTransactionController);
TransactionRouter.get("/all", AuthUser, GetAllTransactionController);
TransactionRouter.get("/:id", AuthUser, GetDetailTransactionController);

module.exports = TransactionRouter;
