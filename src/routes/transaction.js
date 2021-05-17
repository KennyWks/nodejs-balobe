const TransactionRouter = require("express").Router();
const AuthUser = require("../middleware/auth_user");
const {
  GetDetailTransactionController,
  GetAllTransactionController,
} = require("../controllers/transaction");

TransactionRouter.get("/all", AuthUser, GetAllTransactionController);
TransactionRouter.get("/:id", AuthUser, GetDetailTransactionController);

module.exports = TransactionRouter;
