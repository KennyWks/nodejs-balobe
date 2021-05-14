const TransactionRouter = require("express").Router();
const AuthUser = require("../middleware/auth_user");
const {
  GetUserTransactionController,
} = require("../controllers/transaction");

TransactionRouter.get("/user", AuthUser, GetUserTransactionController);

module.exports = TransactionRouter;
