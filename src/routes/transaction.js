const TransactionRouter = require("express").Router();
const AuthUser = require("../middleware/auth_user");
const {
  CreateTransactionController,
  GetDetailTransactionController,
  GetAllTransactionBuyController,
  GetAllTransactionSellController
} = require("../controllers/transaction");

TransactionRouter.post("/", AuthUser, CreateTransactionController);
TransactionRouter.get("/buy", AuthUser, GetAllTransactionBuyController);
TransactionRouter.get("/sell/:id", AuthUser, GetAllTransactionSellController);
TransactionRouter.get("/:id", AuthUser, GetDetailTransactionController);

module.exports = TransactionRouter;
