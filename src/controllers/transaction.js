const {
    GetUserTransactionModel
  } = require("../models/transaction");
  
  exports.GetUserTransactionController = async (req, res) => {
    try {
      const result = await GetUserTransactionModel(req.auth.id_user);
      console.log(result);
      if (result[1][0]) {
        res.status(200).send({
          data: result[1][0],
        });
      } else {
        res.status(404).send({
          msg: "id transaction not found",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(404).send({
        error: {
          msg: error.message || "something wrong",
        },
      });
    }
  };