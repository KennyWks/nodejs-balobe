const {
  CreateCartsModel,
  GetAllCartsModel,
  GetDetailCartsModel,
  UpdateCartsModel,
  CheckOutModel,
} = require("../models/carts");

exports.CreateCartsController = async (req, res) => {
  try {
    if (!req.body.total_item) {
      throw new Error("total item can't be empty");
    }
    let totalPrice = req.body.total_item * req.body.price;
    const data = {
      id_user: req.auth.id_user,
      id_item: req.body.id_item,
      id_pelapak: req.body.id_pelapak,
      total_item: req.body.total_item,
      total_price: totalPrice,
      is_check_out: 0,
    };

    const resultQuery = await CreateCartsModel(data);
    if (resultQuery) {
      res.status(200).send({
        data: {
          id: resultQuery[1].insertId,
          msg: "your items is added to carts",
        },
      });
    } else {
      throw new Error("create failed");
    }
  } catch (error) {
    console.log(error);
    res.status(202).send({
      error: {
        msg: error.message || "something wrong!",
      },
    });
  }
};

exports.GetAllCartsController = async (req, res) => {
  try {
    let params = {
      page: req.query.page || 1,
      limit: req.query.limit || 5,
    };

    if (req.query.sort) {
      const sortingValue = req.query.sort.split(".");
      params.sort = {
        key: sortingValue[0],
        value: sortingValue[1] ? sortingValue[1].toUpperCase() : "ASC",
      };
    }

    if (req.query.q) {
      params.search = req.query.q;
    }

    const result = await GetAllCartsModel(params, req.auth.id_user);
    // console.log(result[1][0].total);
    if (result) {
      const totalData = result[1][0].total;
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
            total: totalData,
          },
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

exports.GetDetailCartsController = async (req, res) => {
  try {
    const result = await GetDetailCartsModel(req.params.id);
    // console.log(result);
    if (result[1][0]) {
      res.status(200).send({
        data: result[1][0],
      });
    } else {
      res.status(404).send({
        msg: "id carts not found",
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

exports.UpdateCartsController = async (req, res) => {
  try {
    const data = {
      total_item: req.body.total_item,
      total_price: req.body.total_price,
    };
    const result = await UpdateCartsModel(req.params.id, data);
    // console.log(result);
    if (result) {
      res.status(200).send({
        data: {
          msg: `Your carts with id ${req.params.id} is updated`,
        },
      });
    } else {
      res.status(202).send({
        data: {
          msg: `Carts with id ${reg.params.id} Not Exists`,
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

exports.CheckOutContoller = async (req, res) => {
  try {
    const data = {
      id_user: req.auth.id_user,
      list_item: req.body.list_item,
      total_item: req.body.total_item,
      total_price: req.body.total_price,
    };
    const result = await CheckOutModel(req.params.id, data);
    // console.log(result);
    if (result) {
      res.status(200).send({
        data: {
          id: parseInt(req.params.id),
          msg: `your transaction is success`,
        },
      });
    } else {
      res.status(202).send({
        data: {
          msg: `Carts with id ${reg.params.id} Not Exists`,
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
