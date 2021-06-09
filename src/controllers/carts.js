const {
  CreateCartsModel,
  GetAllCartsModel,
  GetDetailCartsModel,
  UpdateCartsModel,
  CheckOutModel,
  CheckOutCheckedModel,
  DeleteCartsModel,
} = require("../models/carts");

exports.CreateCartsController = async (req, res) => {
  try {
    if (!Object.keys(req.body).length > 0) {
      throw new Error("Please add data to process");
    }

    let totalPrice = req.body.total_item * req.body.price;
    const data = {
      id_user: req.auth.id_user,
      id_item: req.body.id_item,
      id_pelapak: req.body.id_pelapak,
      total_item: req.body.total_item,
      total_price: totalPrice,
      courier: req.body.courier,
      is_check_out: 0,
    };

    const result = await CreateCartsModel(data);
    // console.log(result);
    res.status(201).send({
      data: {
        id: result[1].insertId,
        msg: "Your items is added to carts",
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
    // console.log(result[1][0]);
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
    res.status(500).send({
      error: {
        msg: error.message || "Something wrong",
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
        error: {
          msg: "Carts is not found",
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

exports.UpdateCartsController = async (req, res) => {
  try {
    if (!Object.keys(req.body).length > 0) {
      throw new Error("Please add data to update");
    }

    const dataUpdate = {};
    const fillAble = ["total_item", "total_price"];
    fillAble.forEach((v) => {
      if (req.body[v]) {
        dataUpdate[v] = req.body[v];
      }
    });

    const result = await UpdateCartsModel(req.params.id, dataUpdate);
    console.log(result);
    if (result) {
      res.status(200).send({
        data: {
          msg: `Your carts is updated`,
        },
      });
    } else {
      res.status(404).send({
        error: {
          msg: `Carts is not found`,
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

exports.CheckOutContoller = async (req, res) => {
  try {
    if (!Object.keys(req.body).length > 0) {
      throw new Error("Please add data to process");
    }

    const data = {
      id_user: req.auth.id_user,
      id_pelapak: req.body.id_pelapak,
      list_item: req.body.list_item,
      total_item: req.body.total_item,
      courier: req.body.courier,
      total_price: req.body.total_price,
    };
    const result = await CheckOutModel(req.params.id, data);
    // console.log(result);
    if (result) {
      res.status(200).send({
        data: {
          id: req.params.id,
          msg: `Your transaction is successfully process`,
        },
      });
    } else {
      res.status(404).send({
        error: {
          msg: `Carts is not found`,
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

exports.CheckOutCheckedController = async (req, res) => {
  try {
    if (!Object.keys(req.body).length > 0) {
      throw new Error("Please add data to process");
    }

    const result = await CheckOutCheckedModel(req.body);
    // console.log(result);
    if (result) {
      res.status(200).send({
        data: {
          msg: `Your transaction is successfully process`,
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

exports.DeleteCartsController = async (req, res) => {
  try {
    const result = await DeleteCartsModel(req.params.id);
    // console.log(result);
    if (result[1].affectedRows) {
      res.status(200).send({
        data: {
          id: parseInt(req.params.id),
          msg: `Your carts succesfully canceled`,
        },
      });
    } else {
      res.status(404).send({
        error: {
          msg: `Carts is not found`,
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
