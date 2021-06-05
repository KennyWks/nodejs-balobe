const {
    CreateRoleModel,
    GetAllRoleModel,
    GetDetailRoleModel,
    UpdateRoleModel,
    DeleteRoleModel
} = require("../models/role");

exports.CreateRoleController = async (req, res) => {
    try {
        if (!req.body.name) {
             throw new Error("field name is required")
         }
         const result = await CreateRoleModel(req.body.name);
         console.log(result);
         res.status(201).send({
            data: {
                id: result[1].insertId,
                msg: `Role succesfully created with id ${result[1].insertId}`
            },
         });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: {
                msg: error.message || "something wrong!"
            },
        });
    }
};

exports.GetAllRoleController = async (req, res) => {
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

        const result = await GetAllRoleModel(params);
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
                msg: error.message || "something wrong",
            },
        });
    }
};


exports.GetDetailRoleController = async (req, res) => {
    try {
        const result = await GetDetailRoleModel(req.params.id);
        console.log(result);
        if (result[1][0]) {
            res.status(200).send({
                data: result[1][0],
            });
        } else {
            res.status(404).send({
                error: {
                    msg: `Role with id ${req.params.id} is not found`
                },
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: {
                msg: error.message || "something wrong",
            },
        });
    }
};

exports.UpdateRoleController = async (req, res) => {
    try {
        if (!Object.keys(req.body).length > 0) {
            throw new Error("Please add data to update");
        }

        const dataUpdate = {};
        const fillAble = ['name'];
        fillAble.forEach((v) => {
            if (req.body[v]) {
                dataUpdate[v] = req.body[v];
            }
        });

        const result = await UpdateRoleModel(req.params.id, dataUpdate);
        console.log(result);
        res.status(200).send({
            data: {
                id: req.params.id,
                msg: `Role with id ${req.params.id} is succesfully updated`
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: {
                msg: error.message || "something wrong",
            },
        });
    }
};

exports.DeleteRoleController = async (req, res) => {
    try {
        const result = await DeleteRoleModel(req.params.id);
        console.log(result);
        if (result[1].affectedRows) {
            res.status(200).send({
                data: {
                    id: parseInt(req.params.id),
                    msg: `Role with id ${req.params.id} succesfully deleted`,
                }
            });
        } else{
            res.status(404).send({
                error: {
                    msg: `Role with id ${reg.params.id} is not exists`,
                },
            }); 
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: {
                msg: error.message || "something wrong",
            },
        });
    }
};