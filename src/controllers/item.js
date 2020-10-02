const firebaseAdmin = require("../config/firebase");
const fs = require("fs");
const {
    CreateItemModel,
    GetAllItemModel,
    GetDetailItemModel,
    UpdateItemModel,
    DeleteItemModel,
    GetDataItem,
    UpdateImageItemModel,
    CreateReviewItemModel,
    UpdateReviewItemModel,
    GetReviewByUserModel,
    GetReviewByIdModel,
    GetAllReviewModel
} = require("../models/item");

// controller for controller items
exports.CreateItemController = async (req, res) => {
    try {
        if (!req.body.name || !req.body.price || !req.body.quantity || !req.body.description) {
            throw new Error("data can't be empty")
        }
        if (process.env.APP_ENV === 'development') {
            let webPath = req.file.path.replace(/\\/g, '/');
            const dataItems = {
                id_pelapak: req.body.id_pelapak,
                id_category: req.body.id_category,
                name: req.body.name,
                price: req.body.price,
                quantity: req.body.quantity,
                description: req.body.description,
                image: webPath,
            }

            const resultQuery = await CreateItemModel(dataItems);
            console.log(resultQuery);
            if (resultQuery) {
                res.status(200).send({
                    data: {
                        id: resultQuery[1].insertId,
                        msg: "create item success"
                    },
                });
            } else {
                throw new Error("create failed")
            }
        } else {
            const nameFileItem = new Date().getTime();
            const pathFile = `img-items/${nameFileItem}.${req.file.mimetype.split("/")[1]}`;

            const dataItems = {
                id_pelapak: req.body.id_pelapak,
                id_category: req.body.id_category,
                name: req.body.name,
                price: req.body.price,
                quantity: req.body.quantity,
                description: req.body.description,
                image: pathFile,
            }

            const resultQuery = await CreateItemModel(dataItems);
            const bucket = firebaseAdmin.storage().bucket();
            const data = bucket.file(pathFile);
            await data.save(req.file.buffer);
            res.status(200).send({
                data: {
                    path: `https://firebasestorage.googleapis.com/v0/b/balobe-d2a28.appspot.com/o/${encodeURIComponent(pathFile)}?alt=media`,
                    msg: "upload image is success"
                }
            });
        }
    } catch (error) {
        console.log(error);
        res.status(202).send({
            error: {
                msg: error.message || "something wrong!"
            },
        });
    }
};

exports.GetAllItemController = async (req, res) => {
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

        const result = await GetAllItemModel(params);
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

exports.GetDetailItemController = async (req, res) => {
    try {
        const result = await GetDetailItemModel(req.params.id);
        console.log(result);
        console.log(req.params.id);
        if (result[1][0]) {
            res.status(200).send({
                data: result[1][0],
            });
        } else {
            res.status(404).send({
                msg: "id item not found"
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

exports.UpdateItemContoller = async (req, res) => {
    try {
        if (!Object.keys(req.body).length > 0) {
            throw new Error("Please add data to update");
        }

        const dataUpdate = {};
        const fillAble = ['id_category', 'name', 'price', 'quantity', 'description'];
        fillAble.forEach((v) => {
            if (req.body[v]) {
                dataUpdate[v] = req.body[v];
            }
        });

        if (!Object.keys(dataUpdate).length > 0) {
            throw new Error("Please add data to update");
        }

        const result = await UpdateItemModel(req.params.id, dataUpdate);
        console.log(result);
        res.status(200).send({
            data: {
                id: req.params.id,
                name: req.body.name
            },
        });
    } catch (error) {
        console.log(error);
        res.status(202).send({
            error: {
                msg: error.message || "something wrong",
            },
        });
    }
};

exports.DeleteItemController = async (req, res) => {
    try {
        const result = await DeleteItemModel(req.params.id);
        console.log(result);
        if (result[1].affectedRows) {
            res.status(200).send({
                data: {
                    id: parseInt(req.params.id),
                    msg: `ID item ${req.params.id} sucessfully deleted`,
                }
            });
        } else {
            res.status(202).send({
                data: {
                    msg: `item with id ${reg.params.id} Not Exists`,
                }
            });
        }
    } catch (error) {
        console.log(error);
        res.status(202).send({
            error: {
                msg: error.message || "something wrong",
            },
        });
    }
};

exports.UpdateItemImageContoller = async (req, res) => {
    try {
        const resultGetData = await GetDataItem(req.params.id_item);
        if (resultGetData[1][0]) {
            imageOld = resultGetData[1][0].image;

            if (process.env.APP_ENV === 'development') {

                let webPath = req.file.path.replace(/\\/g, '/');
                if (imageOld !== webPath) {
                    let deleteImage = "./" + imageOld;
                    fs.unlink(deleteImage, function (err) {
                        if (err && err.code == 'ENOENT') {
                            // file doens't exist
                            console.info("File doesn't exist, won't remove it.");
                        } else if (err) {
                            // other errors, e.g. maybe we don't have enough permission
                            console.error("Error occurred while trying to remove file");
                        } else {
                            console.info(`removed`);
                        }
                    });
                }

                const resultUpdate = await UpdateImageItemModel(webPath, req.params.id_item);

                res.status(200).send({
                    data: {
                        id_item: req.params.id_item,
                        lokasiFile: webPath,
                        msg: "upload image is success"
                    }
                })
            } else {
                const nameFileItem = new Date().getTime();
                const pathFile = `img-items/${nameFileItem}.${req.file.mimetype.split("/")[1]}`;

                if (imageOld !== pathFile) {
                    let deleteImage = `https://firebasestorage.googleapis.com/v0/b/balobe-d2a28.appspot.com/o/${encodeURIComponent(imageOld)}`;
                    fs.unlink(deleteImage, function (err) {
                        if (err && err.code == 'ENOENT') {
                            // file doens't exist
                            console.info("File doesn't exist, won't remove it.");
                        } else if (err) {
                            // other errors, e.g. maybe we don't have enough permission
                            console.error("Error occurred while trying to remove file");
                        } else {
                            console.info(`removed`);
                        }
                    });
                }

                const resultUpdate = await UpdateImageItemModel(pathFile, req.params.id_item);
                const bucket = firebaseAdmin.storage().bucket();
                const data = bucket.file(pathFile);
                await data.save(req.file.buffer);
                res.status(200).send({
                    data: {
                        path: `https://firebasestorage.googleapis.com/v0/b/balobe-d2a28.appspot.com/o/${encodeURIComponent(pathFile)}?alt=media`,
                        msg: "upload image is success"
                    }
                });
            }
        } else {
            res.status(404).send({
                msg: "id item not found"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(202).send({
            error: {
                msg: error.message || "Something wrong"
            }
        })
    }
}
//end line code for controller items

//controller for items review
exports.CreateReviewController = async (req, res) => {
    try {
        if (!req.body.rating || !req.body.review) {
            throw new Error("data rating or review can't be empty")
        }

        const data = {
            id_user: req.auth.id_user,
            id_item: req.body.id_item,
            rating: req.body.rating,
            review: req.body.review
        }

        const resultQuery = await CreateReviewItemModel(data);
        console.log(resultQuery);
        if (resultQuery) {
            res.status(200).send({
                data: {
                    id: resultQuery[1].insertId,
                    msg: "create item success"
                },
            });
        } else {
            throw new Error("create failed")
        }
    } catch (error) {
        console.log(error);
        res.status(202).send({
            error: {
                msg: error.message || "something wrong!"
            },
        });
    }
};

exports.UpdateReviewController = async (req, res) => {
    try {
        if (!Object.keys(req.body).length > 0) {
            throw new Error("Please add data to update");
        }

        const dataUpdate = {};
        const fillAble = ['rating', 'review'];
        fillAble.forEach((v) => {
            if (req.body[v]) {
                dataUpdate[v] = req.body[v];
            }
        });

        if (!Object.keys(dataUpdate).length > 0) {
            throw new Error("Please add data to update");
        }

        const result = await UpdateReviewItemModel(req.params.id, dataUpdate);
        console.log(result);
        res.status(200).send({
            data: {
                id: req.params.id,
                name: req.body.name
            },
        });
    } catch (error) {
        console.log(error);
        res.status(202).send({
            error: {
                msg: error.message || "something wrong",
            },
        });
    }
}

exports.GetReviewByUserController = async (req, res) => {
    try {
        console.log(req.auth.id_user);
        const result = await GetReviewByUserModel(req.auth.id_user);
        if (result[1][0]) {
            res.status(200).send({
                data: result[1][0],
            });
        } else {
            res.status(404).send({
                msg: "Id user not found"
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

exports.GetReviewByIdController = async (req, res) => {
    try {
        console.log(req.params.id);
        const result = await GetReviewByIdModel(req.params.id);
        if (result[1][0]) {
            res.status(200).send({
                data: result[1][0],
            });
        } else {
            res.status(404).send({
                msg: "id review not found"
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

exports.GetAllReviewController = async (req, res) => {
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

        const result = await GetAllReviewModel(params);
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
//end line code for controller items review