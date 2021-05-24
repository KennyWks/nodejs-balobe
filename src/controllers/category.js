const {
    CreateCategoryModel,
    GetAllCategoryModel,
    GetDetailCategoryModel,
    UpdateCategoryModel,
    DeleteCategoryModel
} = require("../models/category");

exports.CreateCategoryController = async (req, res) => {
    try {
        if (!req.body.name || !req.body.hs_code) {
            throw new Error("field name or HS code is required")
        }
        const resultQuery = await CreateCategoryModel(req.body.hs_code,req.body.name);
        console.log(resultQuery);
        if (resultQuery) {
            res.status(200).send({
                data: {
                    id: resultQuery[1].insertId,
                    msg: `Category with id ${resultQuery[1].insertId} succesfully created`
                },
            });
        } else {
            throw new Error("Error")
        }
    } catch (error) {
        console.log(error);
        res.status(404).send({
            error: {
                msg: error.message || "something wrong!"
            },
        });
    }
};

exports.GetAllCategoryController = async (req, res) => {
    try {
        let params = {
            page: req.query.page || 1,
            limit: req.query.limit || 5,
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

        const result = await GetAllCategoryModel(params);
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

exports.GetDetailCategoryController = async (req, res) => {
    try {
        const result = await GetDetailCategoryModel(req.params.id);
        console.log(result);
        if (result[1][0]) {
            res.status(200).send({
                data: result[1][0],
            });
        } else {
            res.status(404).send({
                msg: `Category with id ${req.params.id} is not found`
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

exports.DeleteCategoryController = async (req, res) => {
    try {
        const result = await DeleteCategoryModel(req.params.id);
        console.log(result);
        if (result[1].affectedRows) {
            res.status(200).send({
                data: {
                    id: parseInt(req.params.id),
                    msg: `Category with id ${req.params.id} succesfully deleted`,
                }
            });
        } else{
            res.status(404).send({
                data: {
                    msg: `Category with id ${req.params.id} is not found`
                }
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

exports.UpdateCategoryController = async (req, res) => {
    try {
        if (!Object.keys(req.body).length > 0) {
            throw new Error("Please add data to update");
        }

        const dataUpdate = {};
        const fillAble = ['hs_code','name'];
        fillAble.forEach((v) => {
            if (req.body[v]) {
                dataUpdate[v] = req.body[v];
            }
        });

        if (!Object.keys(dataUpdate).length > 0) {
            throw new Error("Please add data to update");
        }

        const result = await UpdateCategoryModel(req.params.id, dataUpdate);
        console.log(result);
        res.status(200).send({
            data: {
                id: req.params.id,
                msg: `Category with id ${req.params.id} succesfully updated`,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(404).send({
            error: {
                msg: error.message || "something wrong",
            },
        });
    }
};