const {
  GetDetailTransactionModel,
  GetAllTransactionModel
  } = require("../models/transaction");

  exports.GetDetailTransactionController = async (req, res) => {
    try {
      const result = await GetDetailTransactionModel(req.params.id);
      console.log(result);
      if (result[1][0]) {
        res.status(200).send({
          data: result[1][0],
        });
      } else {
        res.status(404).send({
          msg: "data transaction not found",
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

  exports.GetAllTransactionController = async (req, res) => {
    try {
        let params = {
            page: req.query.page || 1,
            limit: req.query.limit || 5,
            id_user: req.auth.id_user
        }

        if (req.query.sort) {
            const sortingValue = req.query.sort.split(".");
            params.sort = {
                key: sortingValue[0],
                value: sortingValue[1] ? sortingValue[1].toUpperCase() : "ASC"
            };
        }

        if (req.query.q) {
            params.search = req.query.q
        }

        const result = await GetAllTransactionModel(params);
        console.log(result[1][0]);
        if (result) {
            const totalData = result[1][0].total
            const totalPages = Math.ceil(result[1][0].total / parseInt(params.limit));
            res.status(200).send({
                data: result[2],
                metadata: {
                    pagination: {
                        currentPage: params.page,
                        totalPage: totalPages,
                        nextPage: parseInt(params.page) < totalPages,
                        prevPage: parseInt(params.page) > 1,
                        limit: parseInt(params.limit),
                        total: totalData
                    }
                },
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