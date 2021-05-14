const TransactionRouter = require("express").Router();
const AuthUser = require("../middleware/auth_user");
const {
  GetDetailTransactionController,
  GetAllTransactionController,
} = require("../controllers/transaction");

TransactionRouter.get("/:id", AuthUser, GetDetailTransactionController);
TransactionRouter.get("/all", AuthUser, GetAllTransactionController);

module.exports = TransactionRouter;
