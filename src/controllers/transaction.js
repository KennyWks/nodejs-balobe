const {
  CreateTransactionModel,
  GetDetailTransactionModel,
  GetAllTransactionBuyModel,
  GetAllTransactionSellModel
  } = require("../models/transaction");

exports.CreateTransactionController = async (req, res) => {
  try {
    if (!Object.keys(req.body).length > 0) {
      throw new Error("Please add some item to carts");
    }

    for (let i = 0; i < req.body.length; i++) {
      await CreateTransactionModel(req.auth.id_user, req.body[i].id_pelapak, req.body[i].list_item, req.body[i].total_item, req.body[i].courier, req.body[i].total_price);
    }

    res.status(201).send({
      data: {
        msg: `Your transaction is successfully process`,
      },
    });    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: {
        msg: error.message || "Something wrong!",
      },
    });
  }
};

  exports.GetDetailTransactionController = async (req, res) => {
    try {
      const result = await GetDetailTransactionModel(req.params.id);
      // console.log(result);
      if (result[1][0]) {
        res.status(200).send({
          data: result[1][0],
        });
      } else {
        res.status(404).send({
          error: {
            msg: "Data transaction is not found",
          }
      });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        error: {
          msg: error.message || "Something wrong",
        },
      });
    }
  };

  exports.GetAllTransactionSellController = async (req, res) => {
    try {
      let params = {
          page: req.query.page || 1,
          limit: req.query.limit || 5,
          id_pelapak: req.params.id
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

      const result = await GetAllTransactionSellModel(params);
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
      res.status(500).send({
          error: {
              msg: error.message || "Something wrong",
          },
      });
  }
  };

  exports.GetAllTransactionBuyController = async (req, res) => {
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

        const result = await GetAllTransactionBuyModel(params);
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
        res.status(500).send({
            error: {
                msg: error.message || "Something wrong",
            },
        });
    }
};